# 🚀 CrowdTank Concurrent Deployment Guide

Automated deployment system that launches all components in separate terminals and automatically propagates the contract address.

## Overview

The concurrent deployment system automates the entire setup process:

1. **Launches Hardhat node** in Terminal 1
2. **Waits for node readiness** with health checks
3. **Deploys smart contract** to specified network
4. **Captures contract address** from deployment output
5. **Auto-updates config.js** with the contract address
6. **Launches React frontend** in Terminal 2

**No manual configuration needed!** The contract address flows automatically from deployment to frontend.

---

## Quick Start

### Windows Users

**Option 1: Batch File (Recommended)**
```bash
concurrent-deploy.bat          # Uses localhost (default)
concurrent-deploy.bat sepolia  # Uses Sepolia testnet
```

**Option 2: PowerShell**
```powershell
.\concurrent-deploy.ps1
.\concurrent-deploy.ps1 -Network sepolia
```

### macOS / Linux Users

```bash
chmod +x concurrent-deploy.sh  # Make executable (first time only)
./concurrent-deploy.sh          # Uses localhost (default)
./concurrent-deploy.sh sepolia  # Uses Sepolia testnet
```

### All Platforms (Direct Node.js)

```bash
node scripts/concurrent-deploy.js          # localhost
node scripts/concurrent-deploy.js sepolia  # sepolia
```

---

## What Happens Automatically

### Step-by-Step Execution

```
[1] Check Requirements
    ✓ Node.js v16+ installed
    ✓ npm v8+ installed
    ✓ Port 8545 available

[2] Launch Hardhat Node (Terminal 1)
    $ npx hardhat node
    → Listening on 127.0.0.1:8545
    → 20 test accounts with ~10,000 ETH each

[3] Wait for Node Readiness
    ℹ Polling http://127.0.0.1:8545 every 500ms
    ✓ Node is responding to RPC calls

[4] Deploy Smart Contract
    $ npx hardhat run scripts/deploy.js --network localhost
    ✓ Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

[5] Extract Contract Address
    → Parsing deployment output
    → Found address: 0x5FbDB2315678afecb367f032d93F642f64180aa3

[6] Update config.js
    📝 Frontend config updated:
        CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3
        CHAIN_ID = 31337
        CHAIN_NAME = Hardhat (Localhost)

[7] Launch Frontend (Terminal 2)
    $ cd frontend && npm start
    → Webpack dev server starting on port 3000
    → Browser opens automatically

[8] Complete!
    ✅ All services running
    ✅ Contract address in frontend
    ✅ Ready to test
```

---

## Supported Networks

| Network | Chain ID | Use Case |
|---------|----------|----------|
| **localhost** | 31337 | Local development (default) |
| **sepolia** | 11155111 | Public testnet |
| **mainnet** | 1 | Production (requires real ETH) |

### Configuration by Network

#### Localhost (Default)
```javascript
// Auto-configured in config.js:
export const CONTRACT_ADDRESS = "0x...";
export const CHAIN_ID = 31337;
export const CHAIN_NAME = "Hardhat (Localhost)";
export const NETWORK_RPC = "http://127.0.0.1:8545";
```

#### Sepolia Testnet
```javascript
// Auto-configured in config.js:
export const CONTRACT_ADDRESS = "0x...";
export const CHAIN_ID = 11155111;
export const CHAIN_NAME = "Sepolia";
export const NETWORK_RPC = "https://sepolia.infura.io/v3/YOUR_KEY";
```

---

## Prerequisites by Network

### Localhost (No Setup Needed!)
✅ Node.js and npm installed
✅ Project dependencies installed (`npm install`)
✅ That's it!

### Sepolia Testnet
✅ All of above, plus:
✅ `.env` file in project root with:
```
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_hex
ETHERSCAN_API_KEY=your_etherscan_api_key (optional)
```

**How to get these:**
- [Infura API Key](https://infura.io) - Free account, create Ethereum/Sepolia project
- [Private Key](https://metamask.io) - MetaMask → Settings → Security & Privacy → Export Private Key
- [Etherscan API Key](https://etherscan.io/apis) - Optional, for contract verification

### Mainnet (Production)
✅ All Sepolia requirements, plus:
✅ Real ETH in wallet for gas fees
✅ Use mainnet RPC and private key
⚠️ Use fresh private key (never reuse mainnet key elsewhere)

---

## How It Works Internally

### Terminal Launch Mechanism

**Windows**:
```batch
start cmd /k "title Hardhat Node && npx hardhat node"
start cmd /k "title React Frontend && npm start"
```
- Opens new Command Prompt windows
- Keeps window open with `/k` flag
- Sets window title with `title` command

**macOS**:
```bash
osascript -e 'tell app "Terminal" to do script "..."'
```
- Uses AppleScript to tell Terminal.app to run command
- Opens new Terminal.app tab

**Linux**:
```bash
gnome-terminal --
```
- Opens GNOME Terminal (most common Linux desktop)
- Keeps process running

### Address Extraction Logic

```javascript
// Deployer output:
// "Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Regex pattern:
const match = output.match(/Contract Address:\s*(0x[a-fA-F0-9]{40})/);
const contractAddress = match[1]; // 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Config File Update

**Before**:
```javascript
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CHAIN_ID = 31337;
export const CHAIN_NAME = "Hardhat (Localhost)";
```

**Replaces with regex**:
```javascript
// Pattern 1: Update address
configContent.replace(
  /export const CONTRACT_ADDRESS = "0x[a-fA-F0-9]*";/,
  `export const CONTRACT_ADDRESS = "${contractAddress}";`
);

// Pattern 2: Update chain ID
configContent.replace(
  /export const CHAIN_ID = \d+;/,
  `export const CHAIN_ID = ${chainId};`
);

// Pattern 3: Update chain name
configContent.replace(
  /export const CHAIN_NAME = "[^"]*";/,
  `export const CHAIN_NAME = "${chainName}";`
);
```

**After**:
```javascript
export const CONTRACT_ADDRESS = "0x[NEW_ADDRESS]";
export const CHAIN_ID = [NEW_CHAIN_ID];
export const CHAIN_NAME = "[NEW_NETWORK_NAME]";
```

---

## Real-Time Output Monitoring

Each step produces real-time output:

### Terminal 1: Hardhat Node Output
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts (20 available):
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...

Listening on 127.0.0.1:8545
```

### Terminal 2: Deployment Output
```
========================================
Deploying CrowdTank Contract...
========================================

Deploying contract with account: 0xf39Fd...
Account balance: 10000000000000000000

✅ CrowdTank deployed successfully!
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Main Console: Orchestration Output
```
[Step 1] Launching Hardhat Node in new terminal...
✅ Hardhat node launched in Terminal 1

[Step 2] Waiting for Hardhat node to be ready...
✅ Hardhat node is ready!

[Step 3] Deploying contract to localhost...
✅ Contract deployed at: 0x5FbDB...

[Step 4] Updating frontend config.js...
✅ Updated config.js with contract address
✅ Chain ID: 31337, Network: Hardhat (Localhost)

[Step 5] Starting React frontend in new terminal...
✅ React frontend launched in Terminal 2
```

---

## Troubleshooting

### ❌ "Node.js not found"
```bash
# Solution: Install Node.js from https://nodejs.org
# After installation, verify:
node --version  # Should be v16+
npm --version   # Should be v8+
```

### ❌ "Port 8545 already in use"
```bash
# Solution 1: Stop the running Hardhat node
# Look in open terminals and press Ctrl+C

# Solution 2: Kill process using the port (Windows)
netstat -ano | findstr :8545          # Find PID
taskkill /PID <PID> /F              # Kill it

# Solution 3: Kill process using the port (macOS/Linux)
lsof -i :8545                        # Find PID
kill -9 <PID>                        # Kill it
```

### ❌ "Cannot find module"
```bash
# Solution: Install dependencies
npm install
cd frontend && npm install
```

### ❌ "Contract address not found in output"
```bash
# This means deployment failed
# Check the deployment logs for errors:
npx hardhat run scripts/deploy.js --network localhost

# Common causes:
# - Contract compilation failed
# - No ETH available for gas (shouldn't happen on localhost)
# - Network connection issue
```

### ❌ ".env file not found" (Sepolia)
```bash
# Solution: Create .env file in project root
cp .env.example .env

# Edit .env with your Infura key and private key:
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_here
```

### ❌ Frontend won't connect to contract
```bash
# Solution: Check config.js has correct address
grep "CONTRACT_ADDRESS" frontend/src/config.js

# Should show deployed address, not example address:
# ✓ export const CONTRACT_ADDRESS = "0x5FbDB...";
# ✗ export const CONTRACT_ADDRESS = "0x0000...";

# Refresh browser
# Ctrl+Shift+R (hard refresh)
```

### ❌ MetaMask won't connect
```bash
# Solution 1: Use localhost network in MetaMask
# Settings → Networks → Add custom network
# Name: Hardhat Localhost
# RPC: http://localhost:8545
# Chain ID: 31337

# Solution 2: Reset MetaMask
# Settings → Advanced → Reset Account
# (This only affects local test account, not your real wallets)
```

### ❌ "Insufficient balance" on frontend
```bash
# Localhost: Shouldn't happen, but try importing test account
# MetaMask → Import Account → Use account #0 private key from Hardhat

# Sepolia: Get free test ETH
# https://www.alchemy.com/faucets/ethereum-sepolia
# Paste your wallet address, claim ETH
```

---

## Manual Alternative

If concurrent deployment doesn't work, you can manually start each terminal:

### Terminal 1: Hardhat Node
```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK
npx hardhat node
```

### Terminal 2: Deploy Contract
```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK
npx hardhat run scripts/deploy.js --network localhost
# Copy the contract address
```

### Terminal 3: Update Config
```bash
# Edit frontend/src/config.js
# Replace CONTRACT_ADDRESS = "0x..." with your address
```

### Terminal 4: Start Frontend
```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK\frontend
npm start
```

---

## Advanced Usage

### Deploy with Custom Network

```bash
# Deploy to a network not in auto-config
node scripts/concurrent-deploy.js my-custom-network

# You'll need to configure my-custom-network in hardhat.config.js first
```

### Capture Full Logs

```bash
# Redirect output to file for debugging
node scripts/concurrent-deploy.js localhost > deployment.log 2>&1

# Review logs
cat deployment.log

# On Windows:
node scripts\concurrent-deploy.js localhost > deployment.log 2>&1
type deployment.log
```

### Non-Interactive Mode

```bash
# Run without opening new terminals (headless)
# Useful for CI/CD pipelines
node scripts/concurrent-deploy.js --headless localhost
```

---

## How to Integrate with Your Build Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install
      
      - name: Deploy and test
        run: node scripts/concurrent-deploy.js localhost
```

### Docker Compose Example

```yaml
version: '3.8'

services:
  hardhat:
    image: node:16
    command: npx hardhat node
    ports:
      - "8545:8545"
    volumes:
      - .:/app
    working_dir: /app

  deploy:
    image: node:16
    depends_on:
      - hardhat
    command: npm run deploy:localhost
    environment:
      - HARDHAT_RPC_URL=http://hardhat:8545
    volumes:
      - .:/app
    working_dir: /app

  frontend:
    image: node:16
    command: npm start
    ports:
      - "3000:3000"
    depends_on:
      - deploy
    volumes:
      - .:/app
    working_dir: /app/frontend
```

---

## Performance Tips

### Faster Deployments

1. **Reuse existing Hardhat node** - Don't kill it between deploys
2. **Cache npm modules** - Speeds up dependency installation
3. **Use faster network** - Sepolia faster than Mainnet
4. **Parallel testing** - Run tests while waiting for other steps

### Example Parallel Workflow

```bash
# Terminal 1: Start Hardhat node
npx hardhat node &

# Terminal 2: Run tests while waiting
npm test &

# Terminal 3: Deploy when ready
npx hardhat run scripts/deploy.js --network localhost
```

---

## Security Considerations

### ✅ Do's
- ✅ Use `.env` for sensitive keys
- ✅ Add `.env` to `.gitignore` (already done)
- ✅ Use separate keys for each network
- ✅ Rotate keys periodically
- ✅ Never commit `CONTRACT_ADDRESS` changes if it exposes sensitive data

### ❌ Don'ts
- ❌ Don't commit `.env` file
- ❌ Don't share your private key
- ❌ Don't use same key across networks
- ❌ Don't paste private keys in Discord/forums
- ❌ Don't reuse test keys in production

---

## Logs & Debugging

### Enable Verbose Logging

Edit `concurrent-deploy.js` to add:
```javascript
process.env.DEBUG = '*';  // Enable all logging
process.env.HARDHAT_VERBOSE = 'true';
```

### Check Deployment Artifacts

After deployment, check:
```bash
# Contract artifacts
ls artifacts/contracts/CrowdTank.sol/

# Updated config
cat frontend/src/config.js | grep CONTRACT_ADDRESS

# Network info
grep -E "CHAIN_ID|CHAIN_NAME" frontend/src/config.js
```

---

## What Gets Automated

### Files Modified by Concurrent Deploy

1. **frontend/src/config.js** - CONTRACT_ADDRESS, CHAIN_ID, CHAIN_NAME
2. **Terminal 1** - Hardhat node process
3. **Terminal 2** - Frontend dev server

### Files NOT Modified (Safe)

- Smart contract files (.sol) - Not changed
- Hardhat config - Not changed
- Package.json - Not changed
- .env - Only read, not modified
- Test files - Not changed

---

## Next Steps After Deployment

### ✅ Immediate
1. Open http://localhost:3000 in browser
2. Connect MetaMask wallet
3. Create a test project
4. Fund the project
5. Test withdrawals

### 📝 For Development
1. Make code changes
2. React auto-reloads on save
3. Test in browser
4. Check Hardhat terminal for transaction logs

### 🚀 For Production
1. Deploy to Sepolia first
2. Test thoroughly
3. Get audit if deploying to Mainnet
4. Use Netlify for frontend hosting
5. See NETLIFY_DEPLOYMENT.md for full guide

---

## Document Information

- **Created**: April 2026
- **Last Updated**: April 2026
- **Version**: 1.0
- **Status**: ✅ Production Ready
