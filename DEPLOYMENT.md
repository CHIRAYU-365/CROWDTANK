# CrowdTank Deployment Guide

Complete guide to deploy CrowdTank dApp across different environments.

## Table of Contents
1. [Local Deployment](#local-deployment)
2. [Testnet Deployment (Sepolia)](#testnet-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Troubleshooting](#troubleshooting)

---

## Local Deployment

### Prerequisites
- Node.js v16+ installed
- MetaMask or other Web3 wallet installed in browser
- All dependencies installed: `npm install` and `cd frontend && npm install`

### Step 1: Start Hardhat Local Node
```bash
cd d:\PROJECTS\CROWDTANK
npx hardhat node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts (20 available):
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812e339D9B73b0245ad59219f33A8 (10000 ETH)
...
```

**⚠️ Keep this terminal running!**

### Step 2: Deploy Smart Contract
Open a **new terminal** and run:

```bash
cd d:\PROJECTS\CROWDTANK
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**
```
========================================
Deploying CrowdTank Contract...
========================================

✅ CrowdTank deployed successfully!
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3 (example)

========================================
Deployment Summary:
========================================
Network: localhost
Contract: CrowdTank
Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**📝 Copy the Contract Address!**

### Step 3: Update Frontend Configuration
1. Open `frontend/src/config.js`
2. Replace the CONTRACT_ADDRESS:
```javascript
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Use your deployed address
export const CHAIN_ID = 31337; // Keep this for localhost
export const CHAIN_NAME = "Hardhat (Localhost)"; // Keep this for localhost
```

### Step 4: Connect MetaMask to Localhost
1. **Open MetaMask**
2. Click **Settings** (gear icon) → **Networks**
3. Click **Add a custom RPC network**
4. Fill in details:
   - **Network name**: Hardhat Localhost
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 31337
   - **Currency symbol**: ETH
5. Click **Save**
6. Select "Hardhat Localhost" from the network dropdown

### Step 5: Import Test Accounts into MetaMask
1. In MetaMask, click **Import Account**
2. Paste Account #0 private key from Hardhat node output:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb476cbed5490deca5934c4c2f48f
   ```
3. Click **Import**
4. Now you have 10,000 ETH to test with!

### Step 6: Start Frontend
Open a **new terminal** and run:
```bash
cd d:\PROJECTS\CROWDTANK\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
On Your Network: http://localhost:3000
```

**✅ Open http://localhost:3000 in your browser!**

### Step 7: Test the DApp
1. **Connect Wallet**: Click "Connect Wallet" button
2. **Create Project**: Fill in project details and click "Create Project"
3. **Fund Project**: Click "Fund Project" and send ETH
4. **Withdraw**: Try withdrawal operations (after deadline)

---

## Testnet Deployment

### Prerequisites
- Sepolia ETH (get free from [faucets](https://www.alchemy.com/faucets/ethereum-sepolia))
- Private key with Sepolia ETH balance
- Etherscan API key from [etherscan.io](https://etherscan.io/apis)

### Step 1: Configure Environment Variables
Create a `.env` file in project root:

```
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ IMPORTANT: Never commit `.env` to version control!**

### Step 2: Get Sepolia Test ETH
1. Go to [Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
2. Connect your wallet
3. Claim test ETH
4. Wait for transaction to confirm (5-30 seconds)

### Step 3: Deploy to Sepolia
```bash
cd d:\PROJECTS\CROWDTANK
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
========================================
Deploying CrowdTank Contract...
========================================

Deploying contract with account: 0x...
Account balance: 1234567890000000000

✅ CrowdTank deployed successfully!
Contract Address: 0xYourContractAddress...

========================================
Deployment Summary:
========================================
Network: sepolia
Contract: CrowdTank
Address: 0xYourContractAddress...
Deployer: 0x...

⏳ Waiting 5 blocks before verification...
Verifying contract on Etherscan...

========================================
```

**📝 Save the contract address!**

### Step 4: Update Frontend Configuration
Update `frontend/src/config.js`:

```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddress"; // Your Sepolia contract
export const CHAIN_ID = 11155111; // Sepolia Chain ID
export const CHAIN_NAME = "Sepolia Testnet";
```

### Step 5: Switch MetaMask to Sepolia
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia" (or add custom if needed)
4. Chain ID: 11155111
5. RPC: https://sepolia.infura.io/v3/

### Step 6: Start Frontend
```bash
cd frontend
npm start
```

### Step 7: Test on Sepolia
1. Connect your walllet with Sepolia ETH
2. Create projects
3. Fund projects
4. Verify transactions on [Sepolia Etherscan](https://sepolia.etherscan.io)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Prerequisites:**
- Git repository
- Vercel account
- Frontend contract address configured

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Configure:
  - Framework: React
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `build`

3. **Add Environment Variables**
- In Vercel project settings, add:
  - `REACT_APP_CONTRACT_ADDRESS`: Your deployed contract address
  - `REACT_APP_CHAIN_ID`: 11155111 (Sepolia) or 1 (Mainnet)

4. **Deploy**
- Click "Deploy"
- Your app will be live at `your-project.vercel.app`

### Option 2: Netlify

1. **Build the app**
```bash
cd frontend
npm run build
```

2. **Connect to Netlify**
- Drag & drop the `build` folder to [netlify.com](https://netlify.com)
- Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy
```

### Option 3: Traditional Hosting (AWS, Heroku, etc.)

1. **Build for production**
```bash
cd frontend
npm run build
```

2. **Upload `build` folder** to your hosting provider
3. **Configure environment variables** on hosting platform
4. **Set deployment domain** in any CORS settings needed

---

## Post-Deployment Checklist

- [ ] Contract deployed and verified on Etherscan (if testnet)
- [ ] Frontend contract address updated in `config.js`
- [ ] Frontend connected to correct network (Sepolia/Mainnet)
- [ ] Wallet connection working
- [ ] Can create projects
- [ ] Can fund projects
- [ ] Can withdraw/claim funds
- [ ] All error messages display correctly
- [ ] No console errors in browser DevTools
- [ ] Balance updates correctly
- [ ] Transactions appear on block explorer

---

## Verification Commands

### Check Smart Contract

```bash
# Check contract on Etherscan
# For Sepolia: https://sepolia.etherscan.io/address/0xYourContractAddress

# Or interact with contract directly
npx hardhat run scripts/interact.js --network sepolia
```

### Check Frontend

```bash
# Verify no build errors
cd frontend
npm run build

# Check for console errors
npm start
# Open browser console (F12) and check for errors
```

---

## Troubleshooting

### Issue: "Contract address not configured"
**Solution:** Update `CONTRACT_ADDRESS` in `frontend/src/config.js` with your deployed address.

### Issue: "MetaMask not detecting network"
**Solution:** Add custom RPC network in MetaMask with correct Chain ID and RPC URL.

### Issue: "Insufficient balance" when deploying
**Solution:** Get test ETH from Sepolia faucet (see Testnet section).

### Issue: "PRIVATE_KEY not found"
**Solution:** Create `.env` file with `PRIVATE_KEY=your_key_here`

### Issue: Contract not verifying on Etherscan
**Solution:** 
- Wait 5 confirmations after deployment
- Check `ETHERSCAN_API_KEY` is correct
- Verify contract source matches deployment

### Issue: Frontend not connecting to contract
**Solution:**
1. Check contract address in `config.js`
2. Check Chain ID matches network
3. Open browser console (F12) for detailed errors
4. Ensure MetaMask is connected to correct network

---

## Quick Reference

**Local Deployment:**
```bash
# Terminal 1
npx hardhat node

# Terminal 2
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3
cd frontend && npm start
```

**Testnet Deployment:**
```bash
# Configure .env file first
npx hardhat run scripts/deploy.js --network sepolia
# Update config.js with contract address
cd frontend && npm start
```

**Production Frontend:**
```bash
cd frontend
npm run build
# Deploy `build` folder to Vercel/Netlify
```

---

## Support

For issues:
1. Check browser console (F12)
2. Check terminal output for error messages
3. Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. Check Etherscan for transaction logs

Happy deploying! 🚀
