const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdTank", function () {
  let crowdTank;
  let owner, addr1, addr2, addr3;
  let projectId = 1;
  const fundingGoal = ethers.utils.parseEther("10");
  const duration = 86400; // 1 day in seconds

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const CrowdTank = await ethers.getContractFactory("CrowdTank");
    crowdTank = await CrowdTank.deploy();
    await crowdTank.deployed();
    projectId = 1;
  });

  describe("Project Creation", function () {
    it("Should create a new project successfully", async function () {
      await expect(
        crowdTank.createProject(
          "Test Project",
          "A test crowdfunding project",
          fundingGoal,
          duration,
          projectId
        )
      )
        .to.emit(crowdTank, "ProjectCreated")
        .withArgs(
          projectId,
          owner.address,
          "Test Project",
          "A test crowdfunding project",
          fundingGoal,
          await ethers.provider.getBlock("latest").then(b => b.timestamp + duration)
        );

      expect(await crowdTank.isIdUsedCall(projectId)).to.be.true;
    });

    it("Should prevent duplicate project IDs", async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );

      await expect(
        crowdTank.createProject(
          "Another Project",
          "Another test project",
          fundingGoal,
          duration,
          projectId
        )
      ).to.be.revertedWith("Project Id is already used");
    });

    it("Should store project details correctly", async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );

      const project = await crowdTank.getProject(projectId);
      expect(project.creator).to.equal(owner.address);
      expect(project.name).to.equal("Test Project");
      expect(project.description).to.equal("A test crowdfunding project");
      expect(project.fundingGoal).to.equal(fundingGoal);
      expect(project.amountRaised).to.equal(0);
      expect(project.funded).to.be.false;
    });
  });

  describe("Project Funding", function () {
    beforeEach(async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );
    });

    it("Should allow users to fund a project", async function () {
      const fundAmount = ethers.utils.parseEther("5");
      await expect(
        crowdTank.connect(addr1).fundProject(projectId, { value: fundAmount })
      )
        .to.emit(crowdTank, "ProjectFunded")
        .withArgs(projectId, addr1.address, fundAmount);

      const project = await crowdTank.getProject(projectId);
      expect(project.amountRaised).to.equal(fundAmount);
      expect(await crowdTank.getContribution(projectId, addr1.address)).to.equal(
        fundAmount
      );
    });

    it("Should accumulate contributions from multiple users", async function () {
      const fundAmount1 = ethers.utils.parseEther("3");
      const fundAmount2 = ethers.utils.parseEther("5");
      const fundAmount3 = ethers.utils.parseEther("2");

      await crowdTank.connect(addr1).fundProject(projectId, { value: fundAmount1 });
      await crowdTank.connect(addr2).fundProject(projectId, { value: fundAmount2 });
      await crowdTank.connect(addr3).fundProject(projectId, { value: fundAmount3 });

      const project = await crowdTank.getProject(projectId);
      expect(project.amountRaised).to.equal(fundAmount1.add(fundAmount2).add(fundAmount3));
    });

    it("Should allow same user to contribute multiple times", async function () {
      const fundAmount1 = ethers.utils.parseEther("2");
      const fundAmount2 = ethers.utils.parseEther("3");

      await crowdTank.connect(addr1).fundProject(projectId, { value: fundAmount1 });
      await crowdTank.connect(addr1).fundProject(projectId, { value: fundAmount2 });

      const totalContribution = await crowdTank.getContribution(projectId, addr1.address);
      expect(totalContribution).to.equal(fundAmount1.add(fundAmount2));
    });

    it("Should mark project as funded when goal is reached", async function () {
      await crowdTank.connect(addr1).fundProject(projectId, { value: fundingGoal });

      const project = await crowdTank.getProject(projectId);
      expect(project.funded).to.be.true;
    });

    it("Should prevent funding after deadline", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      const fundAmount = ethers.utils.parseEther("5");
      await expect(
        crowdTank.connect(addr1).fundProject(projectId, { value: fundAmount })
      ).to.be.revertedWith("Project deadline is already passed");
    });

    it("Should prevent funding zero amount", async function () {
      await expect(
        crowdTank.connect(addr1).fundProject(projectId, { value: 0 })
      ).to.be.revertedWith("Must send some value of ether");
    });

    it("Should prevent funding a non-existent project", async function () {
      const fundAmount = ethers.utils.parseEther("5");
      await expect(
        crowdTank.connect(addr1).fundProject(999, { value: fundAmount })
      ).to.be.revertedWith("Project does not exist");
    });

    it("Should prevent funding after project is fully funded", async function () {
      await crowdTank.connect(addr1).fundProject(projectId, { value: fundingGoal });

      const fundAmount = ethers.utils.parseEther("1");
      await expect(
        crowdTank.connect(addr2).fundProject(projectId, { value: fundAmount })
      ).to.be.revertedWith("Project is already funded");
    });
  });

  describe("User Withdrawal (Failed Projects)", function () {
    beforeEach(async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );

      // Users fund but not enough to reach goal
      await crowdTank.connect(addr1).fundProject(projectId, {
        value: ethers.utils.parseEther("3"),
      });
      await crowdTank.connect(addr2).fundProject(projectId, {
        value: ethers.utils.parseEther("5"),
      });
    });

    it("Should allow users to withdraw after deadline when goal not reached", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      const addr1Balance = await ethers.provider.getBalance(addr1.address);
      const tx = await crowdTank.connect(addr1).userWithdrawFunds(projectId);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const expectedAmount = ethers.utils.parseEther("3");
      const newBalance = await ethers.provider.getBalance(addr1.address);
      expect(newBalance).to.equal(addr1Balance.add(expectedAmount).sub(gasUsed));
    });

    it("Should emit FundsWithdrawn event for user withdrawal", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      const withdrawAmount = ethers.utils.parseEther("3");
      await expect(crowdTank.connect(addr1).userWithdrawFunds(projectId))
        .to.emit(crowdTank, "FundsWithdrawn")
        .withArgs(projectId, addr1.address, withdrawAmount, "user");
    });

    it("Should prevent withdrawal before deadline", async function () {
      await expect(
        crowdTank.connect(addr1).userWithdrawFunds(projectId)
      ).to.be.revertedWith("Project deadline has not passed yet");
    });

    it("Should prevent withdrawal when project is funded", async function () {
      // Update project with lower goal so it reaches target
      const lowGoal = ethers.utils.parseEther("5");
      const newProjectId = 2;
      await crowdTank.createProject(
        "Low Goal Project",
        "A project with low goal",
        lowGoal,
        duration,
        newProjectId
      );

      await crowdTank.connect(addr1).fundProject(newProjectId, {
        value: ethers.utils.parseEther("6"),
      });

      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      await expect(
        crowdTank.connect(addr1).userWithdrawFunds(newProjectId)
      ).to.be.revertedWith("Funding goal was reached, user cannot withdraw");
    });

    it("Should prevent double withdrawal", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      await crowdTank.connect(addr1).userWithdrawFunds(projectId);

      await expect(
        crowdTank.connect(addr1).userWithdrawFunds(projectId)
      ).to.be.revertedWith("No contribution found for this user");
    });

    it("Should prevent withdrawal for user with no contribution", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      await expect(
        crowdTank.connect(addr3).userWithdrawFunds(projectId)
      ).to.be.revertedWith("No contribution found for this user");
    });
  });

  describe("Admin Withdrawal (Successful Projects)", function () {
    beforeEach(async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );

      // Fund the project to the goal
      await crowdTank.connect(addr1).fundProject(projectId, {
        value: ethers.utils.parseEther("6"),
      });
      await crowdTank.connect(addr2).fundProject(projectId, {
        value: ethers.utils.parseEther("5"),
      });
    });

    it("Should allow creator to withdraw funds after deadline when goal is reached", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      const ownerBalance = await ethers.provider.getBalance(owner.address);
      const tx = await crowdTank.connect(owner).adminWithdrawFunds(projectId);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const expectedAmount = ethers.utils.parseEther("11");
      const newBalance = await ethers.provider.getBalance(owner.address);
      expect(newBalance).to.equal(ownerBalance.add(expectedAmount).sub(gasUsed));
    });

    it("Should emit FundsWithdrawn event for admin withdrawal", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      const totalAmount = ethers.utils.parseEther("11");
      await expect(crowdTank.connect(owner).adminWithdrawFunds(projectId))
        .to.emit(crowdTank, "FundsWithdrawn")
        .withArgs(projectId, owner.address, totalAmount, "admin");
    });

    it("Should prevent non-creator from withdrawing", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      await expect(
        crowdTank.connect(addr1).adminWithdrawFunds(projectId)
      ).to.be.revertedWith("Only project creator can withdraw");
    });

    it("Should prevent withdrawal before deadline", async function () {
      await expect(
        crowdTank.connect(owner).adminWithdrawFunds(projectId)
      ).to.be.revertedWith("Deadline has not been reached yet");
    });

    it("Should prevent withdrawal when goal not reached", async function () {
      const newProjectId = 2;
      const highGoal = ethers.utils.parseEther("100");

      await crowdTank.createProject(
        "High Goal Project",
        "A project with high goal",
        highGoal,
        duration,
        newProjectId
      );

      await crowdTank.connect(addr1).fundProject(newProjectId, {
        value: ethers.utils.parseEther("5"),
      });

      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      await expect(
        crowdTank.connect(owner).adminWithdrawFunds(newProjectId)
      ).to.be.revertedWith("Funding goal not reached");
    });

    it("Should prevent double withdrawal", async function () {
      // Move time forward past the deadline
      await ethers.provider.send("hardhat_mine", [
        "0x" + (Math.floor(duration / 12) + 10).toString(16),
      ]);

      await crowdTank.connect(owner).adminWithdrawFunds(projectId);

      await expect(
        crowdTank.connect(owner).adminWithdrawFunds(projectId)
      ).to.be.revertedWith("No funds to withdraw");
    });
  });

  describe("Query Functions", function () {
    it("Should return correct project details", async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );

      const project = await crowdTank.getProject(projectId);
      expect(project.creator).to.equal(owner.address);
      expect(project.name).to.equal("Test Project");
      expect(project.fundingGoal).to.equal(fundingGoal);
    });

    it("Should revert when querying non-existent project", async function () {
      await expect(
        crowdTank.getProject(999)
      ).to.be.revertedWith("Project does not exist");
    });

    it("Should return zero for users with no contribution", async function () {
      await crowdTank.createProject(
        "Test Project",
        "A test crowdfunding project",
        fundingGoal,
        duration,
        projectId
      );

      const contribution = await crowdTank.getContribution(projectId, addr1.address);
      expect(contribution).to.equal(0);
    });
  });
});
