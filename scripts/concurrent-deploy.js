/**
 * CrowdTank Concurrent Deployment Orchestrator
 * 
 * This script:
 * 1. Launches Hardhat node in Terminal 1
 * 2. Waits for node to be ready
 * 3. Deploys contract in Terminal 2 and captures contract address
 * 4. Updates config.js with the contract address
 * 5. Starts frontend in Terminal 3
 * 
 * Usage:
 *   node scripts/concurrent-deploy.js [network]
 *   
 * Examples:
 *   node scripts/concurrent-deploy.js localhost    (default)
 *   node scripts/concurrent-deploy.js sepolia
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Configuration
const NETWORK = process.argv[2] || "localhost";
const PROJECT_ROOT = path.join(__dirname, "..");
const FRONTEND_DIR = path.join(PROJECT_ROOT, "frontend");
const CONFIG_FILE = path.join(FRONTEND_DIR, "src", "config.js");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Logging utilities
const log = {
  header: (text) => console.log(`\n${colors.cyan}${colors.bright}${text}${colors.reset}`),
  success: (text) => console.log(`${colors.green}✅ ${text}${colors.reset}`),
  error: (text) => console.log(`${colors.red}❌ ${text}${colors.reset}`),
  warning: (text) => console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`),
  info: (text) => console.log(`${colors.blue}ℹ️  ${text}${colors.reset}`),
  step: (num, text) => console.log(`${colors.bright}[Step ${num}]${colors.reset} ${text}`),
};

/**
 * Spawn a process and return it with helper methods
 */
function spawnProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "pipe",
      shell: true,
      ...options,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout?.on("data", (data) => {
      stdout += data.toString();
      process.stdout.write(`  ${data}`); // Display in real-time
    });

    proc.stderr?.on("data", (data) => {
      stderr += data.toString();
      process.stderr.write(`  ${data}`); // Display in real-time
    });

    proc.on("close", (code) => {
      resolve({
        code,
        stdout,
        stderr,
        process: proc,
      });
    });

    proc.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Wait for hardhat node to be ready
 */
async function waitForHardhatNode(maxWaitTime = 30000) {
  log.step(2, "Waiting for Hardhat node to be ready...");
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch("http://127.0.0.1:8545", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_chainId",
          params: [],
          id: 1,
        }),
      });

      if (response.ok) {
        log.success("Hardhat node is ready!");
        return true;
      }
    } catch (error) {
      // Node not ready yet, wait and retry
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Hardhat node took too long to start");
}

/**
 * Extract contract address from deploy output
 */
function extractContractAddress(output) {
  const match = output.match(/Contract Address:\s*(0x[a-fA-F0-9]{40})/);
  return match ? match[1] : null;
}

/**
 * Update config.js with new contract address
 */
function updateConfigFile(contractAddress, network) {
  if (!fs.existsSync(CONFIG_FILE)) {
    log.error(`Config file not found: ${CONFIG_FILE}`);
    return false;
  }

  let configContent = fs.readFileSync(CONFIG_FILE, "utf8");

  // Determine chain ID and chain name based on network
  let chainId = 31337;
  let chainName = "Hardhat (Localhost)";
  let networkRpc = "http://127.0.0.1:8545";

  if (network === "sepolia") {
    chainId = 11155111;
    chainName = "Sepolia";
    networkRpc = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
  } else if (network === "mainnet") {
    chainId = 1;
    chainName = "Ethereum Mainnet";
    networkRpc = "https://mainnet.infura.io/v3/YOUR_INFURA_KEY";
  }

  // Update CONTRACT_ADDRESS
  configContent = configContent.replace(
    /export const CONTRACT_ADDRESS = "0x[a-fA-F0-9]*";/,
    `export const CONTRACT_ADDRESS = "${contractAddress}";`
  );

  // Update CHAIN_ID
  configContent = configContent.replace(
    /export const CHAIN_ID = \d+;/,
    `export const CHAIN_ID = ${chainId};`
  );

  // Update CHAIN_NAME
  configContent = configContent.replace(
    /export const CHAIN_NAME = "[^"]*";/,
    `export const CHAIN_NAME = "${chainName}";`
  );

  // Update NETWORK_RPC if it exists, otherwise add it
  if (configContent.includes("export const NETWORK_RPC")) {
    configContent = configContent.replace(
      /export const NETWORK_RPC = "[^"]*";/,
      `export const NETWORK_RPC = "${networkRpc}";`
    );
  } else {
    // Add after CHAIN_NAME
    configContent = configContent.replace(
      /export const CHAIN_NAME = "[^"]*";/,
      `export const CHAIN_NAME = "${chainName}";\nexport const NETWORK_RPC = "${networkRpc}";`
    );
  }

  fs.writeFileSync(CONFIG_FILE, configContent);
  log.success(`Updated config.js with contract address: ${contractAddress}`);
  log.success(`Chain ID: ${chainId}, Network: ${chainName}`);
  return true;
}

/**
 * Open a new terminal (platform-specific)
 */
function openNewTerminal(command, title) {
  const isWindows = os.platform() === "win32";
  const isMac = os.platform() === "darwin";

  if (isWindows) {
    // Windows: Use 'start' command with new window
    spawn("cmd.exe", ["/c", `start cmd /k "title ${title} && cd ${PROJECT_ROOT} && ${command}"`], {
      stdio: "ignore",
      shell: true,
      detached: true,
    });
  } else if (isMac) {
    // macOS: Use osascript to open Terminal
    const script = `tell app "Terminal" to do script "cd ${PROJECT_ROOT} && ${command}"`;
    spawn("osascript", ["-e", script], {
      stdio: "ignore",
      detached: true,
    });
  } else {
    // Linux: Use gnome-terminal or xterm
    spawn("gnome-terminal", ["--", "bash", "-c", `cd ${PROJECT_ROOT} && ${command}; bash`], {
      stdio: "ignore",
      detached: true,
    });
  }
}

/**
 * Main orchestration function
 */
async function main() {
  try {
    log.header("🚀 CrowdTank Concurrent Deployment Orchestrator");
    log.info(`Network: ${NETWORK}`);
    log.info(`Project Root: ${PROJECT_ROOT}`);
    log.info(`Platform: ${os.platform()}`);

    // Step 1: Launch Hardhat Node
    log.step(1, "Launching Hardhat Node in new terminal...");
    const isWindows = os.platform() === "win32";
    
    if (isWindows) {
      // Windows: Launch in new cmd window
      spawn("cmd.exe", [
        "/c",
        `start cmd /k "title Hardhat Node [Terminal 1] && cd ${PROJECT_ROOT} && npx hardhat node"`,
      ], {
        stdio: "ignore",
        shell: true,
        detached: true,
      });
    } else {
      // Unix: Launch in background
      openNewTerminal("npx hardhat node", "Hardhat Node [Terminal 1]");
    }

    log.success("Hardhat node launched in Terminal 1");

    // Wait for hardhat node to be ready
    try {
      await waitForHardhatNode();
    } catch (error) {
      log.error("Could not verify Hardhat node startup. Make sure port 8545 is available.");
      log.info("Attempting to continue anyway...");
    }

    // Step 2: Deploy Contract
    log.step(3, `Deploying contract to ${NETWORK}...`);
    const deployResult = await spawnProcess("npx", [
      "hardhat",
      "run",
      "scripts/deploy.js",
      `--network`,
      NETWORK,
    ]);

    if (deployResult.code !== 0) {
      log.error(`Deployment failed with code ${deployResult.code}`);
      log.error(`stderr: ${deployResult.stderr}`);
      throw new Error("Contract deployment failed");
    }

    // Extract contract address
    const contractAddress = extractContractAddress(deployResult.stdout);
    if (!contractAddress) {
      log.error("Could not extract contract address from deployment output");
      log.info("Output was:", deployResult.stdout);
      throw new Error("Contract address extraction failed");
    }

    log.success(`Contract deployed at: ${contractAddress}`);

    // Step 3: Update config.js
    log.step(4, "Updating frontend config.js...");
    const configUpdated = updateConfigFile(contractAddress, NETWORK);
    if (!configUpdated) {
      log.error("Failed to update config.js");
      throw new Error("Config update failed");
    }

    // Step 4: Start Frontend
    log.step(5, "Starting React frontend in new terminal...");
    if (isWindows) {
      spawn("cmd.exe", [
        "/c",
        `start cmd /k "title React Frontend [Terminal 2] && cd ${FRONTEND_DIR} && npm start"`,
      ], {
        stdio: "ignore",
        shell: true,
        detached: true,
      });
    } else {
      openNewTerminal(`cd ${FRONTEND_DIR} && npm start`, "React Frontend [Terminal 2]");
    }

    log.success("React frontend launched in Terminal 2");

    // Summary
    log.header("✨ Deployment Complete!");
    log.success("All services are running:");
    log.info("Terminal 1: Hardhat Node (http://127.0.0.1:8545)");
    log.info("Terminal 2: React Frontend (http://localhost:3000)");
    log.info(`Contract Address: ${contractAddress}`);
    log.info(`Network: ${NETWORK}`);
    log.info(`Config File: ${CONFIG_FILE}`);

    if (NETWORK === "localhost") {
      log.warning("\nℹ️  Next Steps:");
      log.info("1. Open http://localhost:3000 in your browser");
      log.info("2. Connect MetaMask and import test account");
      log.info("3. Test creating and funding projects");
      log.info("4. Check the Hardhat node terminal for transaction logs");
    }

    log.info("\n📝 Contract Address has been automatically updated in config.js");
    log.info("✅ You can now use the app without manual configuration!");
  } catch (error) {
    log.error(`Orchestration failed: ${error.message}`);
    log.warning("Please check the error messages above and try again.");
    process.exit(1);
  }
}

// Run the orchestrator
main();
