// This script demonstrates how to interact with the deployed CrowdTank contract
// Usage: npx hardhat run scripts/interact.js --network localhost
//        Update CONTRACT_ADDRESS with your deployed contract address

const hre = require("hardhat");
const ethers = hre.ethers;

// ⚠️  IMPORTANT: Set CONTRACT_ADDRESS environment variable with your deployed contract address
// Get it from running: npx hardhat run scripts/deploy.js --network localhost
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function main() {
  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: CONTRACT_ADDRESS is not set!");
    console.error("Please deploy the contract first:");
    console.error("  npx hardhat run scripts/deploy.js --network localhost");
    console.error("Then copy the contract address and:");
    console.error("  SET CONTRACT_ADDRESS=0x... (on Windows)");
    console.error("  export CONTRACT_ADDRESS=0x... (on Mac/Linux)");
    process.exit(1);
  }

  const [deployer, user1, user2] = await ethers.getSigners();
  
  let crowdTank;
  try {
    crowdTank = await ethers.getContractAt("CrowdTank", CONTRACT_ADDRESS);
  } catch (error) {
    console.error("❌ Error: Could not load contract at address:", CONTRACT_ADDRESS);
    console.error("Make sure the address is correct and the contract is deployed.");
    process.exit(1);
  }

  console.log("========================================");
  console.log("CrowdTank Interaction Demo");
  console.log("========================================\n");

  // 1. Create a new project
  console.log("1️⃣  Creating a new project...");
  const projectName = "Build a Community App";
  const projectDescription = "We're building an awesome web3 community application";
  const fundingGoal = ethers.utils.parseEther("10");
  const duration = 7 * 24 * 60 * 60; // 7 days
  const projectId = Math.floor(Date.now() / 1000); // Use timestamp for unique ID

  try {
    const createTx = await crowdTank.createProject(
      projectName,
      projectDescription,
      fundingGoal,
      duration,
      projectId
    );
    await createTx.wait();
    console.log(`✅ Project created! Project ID: ${projectId}`);
    console.log(`   Name: ${projectName}`);
    console.log(`   Funding Goal: ${ethers.utils.formatEther(fundingGoal)} ETH`);
    console.log(`   Duration: ${duration / (24 * 60 * 60)} days\n`);
  } catch (error) {
    console.log(`❌ Error creating project: ${error.message}\n`);
    return;
  }

  // 2. Get project details
  console.log("2️⃣  Fetching project details...");
  try {
    const project = await crowdTank.getProject(projectId);
    console.log(`✅ Project Details:`);
    console.log(`   Creator: ${project.creator}`);
    console.log(`   Name: ${project.name}`);
    console.log(`   Description: ${project.description}`);
    console.log(`   Funding Goal: ${ethers.utils.formatEther(project.fundingGoal)} ETH`);
    console.log(`   Amount Raised: ${ethers.utils.formatEther(project.amountRaised)} ETH`);
    console.log(`   Funded: ${project.funded}`);
    console.log(`   Deadline: ${new Date(project.deadline * 1000).toLocaleString()}\n`);
  } catch (error) {
    console.log(`❌ Error fetching project: ${error.message}\n`);
    return;
  }

  // 3. Fund the project from user1
  console.log("3️⃣  User1 funding the project...");
  const fundAmount1 = ethers.utils.parseEther("3");
  try {
    const fundTx = await crowdTank.connect(user1).fundProject(projectId, {
      value: fundAmount1,
    });
    await fundTx.wait();
    console.log(`✅ User1 funded ${ethers.utils.formatEther(fundAmount1)} ETH`);
    console.log(`   Account: ${user1.address}\n`);
  } catch (error) {
    console.log(`❌ Error funding project: ${error.message}\n`);
    return;
  }

  // 4. Fund the project from user2
  console.log("4️⃣  User2 funding the project...");
  const fundAmount2 = ethers.utils.parseEther("8");
  try {
    const fundTx = await crowdTank.connect(user2).fundProject(projectId, {
      value: fundAmount2,
    });
    await fundTx.wait();
    console.log(`✅ User2 funded ${ethers.utils.formatEther(fundAmount2)} ETH`);
    console.log(`   Account: ${user2.address}\n`);
  } catch (error) {
    console.log(`❌ Error funding project: ${error.message}\n`);
    return;
  }

  // 5. Check updated project details
  console.log("5️⃣  Checking updated project details...");
  try {
    const project = await crowdTank.getProject(projectId);
    console.log(`✅ Updated Project Status:`);
    console.log(`   Amount Raised: ${ethers.utils.formatEther(project.amountRaised)} ETH`);
    console.log(`   Funded: ${project.funded}`);
    console.log(`   Total Contributors: 2\n`);
  } catch (error) {
    console.log(`❌ Error fetching project: ${error.message}\n`);
    return;
  }

  // 6. Check individual contributions
  console.log("6️⃣  Checking user contributions...");
  try {
    const user1Contribution = await crowdTank.getContribution(projectId, user1.address);
    const user2Contribution = await crowdTank.getContribution(projectId, user2.address);
    console.log(`✅ Contributions:`);
    console.log(`   User1: ${ethers.utils.formatEther(user1Contribution)} ETH`);
    console.log(`   User2: ${ethers.utils.formatEther(user2Contribution)} ETH\n`);
  } catch (error) {
    console.log(`❌ Error fetching contributions: ${error.message}\n`);
    return;
  }

  // 7. Admin withdrawal (after deadline)
  console.log("7️⃣  Admin withdrawal (demo - would need time travel in production)...");
  console.log(`   Note: In production, you would:`);
  console.log(`   1. Wait for the project deadline (${duration / (24 * 60 * 60)} days)`);
  console.log(`   2. Call adminWithdrawFunds to claim the funds\n`);

  console.log("========================================");
  console.log("✅ Interaction demo completed!");
  console.log("========================================\n");

  console.log("Common Commands:");
  console.log("  Get project: crowdTank.getProject(projectId)");
  console.log("  Fund project: crowdTank.fundProject(projectId, { value: ethers.utils.parseEther('1') })");
  console.log("  Check contribution: crowdTank.getContribution(projectId, address)");
  console.log("  User withdrawal: crowdTank.userWithdrawFunds(projectId)");
  console.log("  Admin withdrawal: crowdTank.adminWithdrawFunds(projectId)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
