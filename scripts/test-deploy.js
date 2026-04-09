// Quick test script to verify contract deployment and basic functionality
// Usage: npx hardhat run scripts/test-deploy.js --network localhost

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  console.log("========================================");
  console.log("CrowdTank Contract Test");
  console.log("========================================\n");

  // Get accounts
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("📝 Using accounts:");
  console.log(`  Deployer: ${deployer.address}`);
  console.log(`  User 1:   ${user1.address}`);
  console.log(`  User 2:   ${user2.address}`);
  
  // Get balances
  const deployerBalance = await deployer.getBalance();
  console.log(`\n💰 Deployer balance: ${ethers.utils.formatEther(deployerBalance)} ETH\n`);

  // Deploy contract
  console.log("1️⃣  Deploying CrowdTank contract...");
  const CrowdTank = await ethers.getContractFactory("CrowdTank");
  const crowdTank = await CrowdTank.deploy();
  await crowdTank.deployed();
  console.log(`✅ Contract deployed at: ${crowdTank.address}\n`);

  // Save address for easy reference
  console.log("📌 To use this contract address in interact.js:");
  console.log(`   On Windows CMD: set CONTRACT_ADDRESS=${crowdTank.address}`);
  console.log(`   On PowerShell:  $env:CONTRACT_ADDRESS='${crowdTank.address}'`);
  console.log(`   On Mac/Linux:   export CONTRACT_ADDRESS=${crowdTank.address}\n`);

  // Test 1: Create a project
  console.log("2️⃣  Creating a test project...");
  const tx1 = await crowdTank.createProject(
    "Test Project",
    "A test crowdfunding project",
    ethers.utils.parseEther("10"),
    7 * 24 * 60 * 60, // 7 days
    1 // Project ID
  );
  await tx1.wait();
  console.log("✅ Project created successfully!\n");

  // Test 2: Fund the project
  console.log("3️⃣  Funding project from User 1...");
  const tx2 = await crowdTank.connect(user1).fundProject(1, {
    value: ethers.utils.parseEther("3")
  });
  await tx2.wait();
  console.log("✅ User 1 funded 3 ETH\n");

  // Test 3: Get project details
  console.log("4️⃣  Fetching project details...");
  const project = await crowdTank.getProject(1);
  console.log(`✅ Project Details:`);
  console.log(`   Name: ${project.name}`);
  console.log(`   Description: ${project.description}`);
  console.log(`   Funding Goal: ${ethers.utils.formatEther(project.fundingGoal)} ETH`);
  console.log(`   Amount Raised: ${ethers.utils.formatEther(project.amountRaised)} ETH`);
  console.log(`   Funded: ${project.funded}\n`);

  // Test 4: Check contribution
  console.log("5️⃣  Checking User 1 contribution...");
  const contribution = await crowdTank.getContribution(1, user1.address);
  console.log(`✅ User 1 contributed: ${ethers.utils.formatEther(contribution)} ETH\n`);

  console.log("========================================");
  console.log("✅ All tests passed!");
  console.log("========================================");
  console.log(`\n💡 Next: Use the contract address above in interact.js`);
  console.log(`         npx hardhat run scripts/interact.js --network localhost\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
