const hre = require("hardhat");

async function main() {
  console.log("========================================");
  console.log("Deploying CrowdTank Contract...");
  console.log("========================================\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy CrowdTank
  const CrowdTank = await hre.ethers.getContractFactory("CrowdTank");
  const crowdTank = await CrowdTank.deploy();
  await crowdTank.deployed();

  console.log("\n✅ CrowdTank deployed successfully!");
  console.log("Contract Address:", crowdTank.address);
  
  console.log("\n========================================");
  console.log("Deployment Summary:");
  console.log("========================================");
  console.log(`Network: ${hre.network.name}`);
  console.log(`Contract: CrowdTank`);
  console.log(`Address: ${crowdTank.address}`);
  console.log(`Deployer: ${deployer.address}`);

  // Verify on Etherscan if on a public network and API key is set
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting 5 blocks before verification...");
    await ethers.provider.waitForTransaction(crowdTank.deployTransaction.hash, 5);
    
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: crowdTank.address,
      constructorArguments: [],
    }).catch(err => {
      console.log("Verification skipped:", err.message);
    });
  }

  console.log("\n========================================");
  console.log("Next Steps:");
  console.log("========================================");
  console.log("1. Save the contract address above");
  console.log("2. Update your frontend with the contract address");
  console.log("3. Test with: npx hardhat run scripts/interact.js --network <network>");
  console.log("========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
