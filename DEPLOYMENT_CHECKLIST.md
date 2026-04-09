# CrowdTank Deployment Checklist

## Pre-Deployment Setup

### Environment
- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional but recommended)
- [ ] MetaMask browser extension installed
- [ ] Text editor or IDE (VS Code recommended)

### Repository
- [ ] Project cloned or extracted
- [ ] Working directory: `d:\PROJECTS\CROWDTANK` (or your path)
- [ ] All files present (check `ls -la` or `dir`)

---

## LOCAL DEPLOYMENT (Recommended for Testing)

### Phase 1: Dependencies
- [ ] Run `npm install` in project root
- [ ] Run `npm install` in `frontend/` directory
- [ ] All packages installed successfully (no errors)
- [ ] Check: `npm list hardhat ethers` shows packages

### Phase 2: Start Hardhat Node
- [ ] Open new terminal/PowerShell
- [ ] Navigate to project root
- [ ] Run `npx hardhat node`
- [ ] Output shows: "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
- [ ] Output lists 20 accounts with 10000 ETH each
- [ ] **⚠️ Keep this terminal running!**

### Phase 3: Deploy Smart Contract
- [ ] Open second terminal/PowerShell
- [ ] Run: `npx hardhat run scripts/deploy.js --network localhost`
- [ ] Output shows: "✅ CrowdTank deployed successfully!"
- [ ] **📝 Copy the Contract Address** (looks like `0x5FbDB2315678afecb...`)
- [ ] Output shows all deployment details

### Phase 4: Configure Frontend
- [ ] Open `frontend/src/config.js`
- [ ] Find line: `export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"`
- [ ] Replace with your contract address from Phase 3
- [ ] **Verify CHAIN_ID is 31337** (for Hardhat localhost)
- [ ] **Verify CHAIN_NAME is "Hardhat (Localhost)"**
- [ ] Save the file

### Phase 5: Configure MetaMask
- [ ] Open MetaMask
- [ ] Click Settings → Networks
- [ ] Click "Add a custom RPC network" or "Add Network"
- [ ] Fill in:
  - [ ] Network name: `Hardhat Localhost`
  - [ ] RPC URL: `http://localhost:8545`
  - [ ] Chain ID: `31337`
  - [ ] Currency: `ETH`
- [ ] Click Save
- [ ] Switch to "Hardhat Localhost" network

### Phase 6: Import Test Account
- [ ] In MetaMask, click "Import Account"
- [ ] Paste private key from Hardhat output:
  - [ ] Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb476cbed5490deca5934c4c2f48f`
- [ ] Click Import
- [ ] Verify balance shows **10000 ETH**

### Phase 7: Start Frontend
- [ ] Open third terminal/PowerShell
- [ ] Navigate to `frontend/` folder
- [ ] Run: `npm start`
- [ ] Output shows: "Compiled successfully!"
- [ ] Output shows: "On Your Network: http://localhost:3000"
- [ ] Browser opens automatically (or manually visit http://localhost:3000)

### Phase 8: Test the DApp
- [ ] Frontend loads without errors
- [ ] No red errors in browser console (F12)
- [ ] "Connect Wallet" button visible
- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] Click "Connect" in MetaMask
- [ ] Button changes to show your address (0x... format)
- [ ] Balance displays correctly (**10000 ETH**)

### Phase 9: Test Project Creation
- [ ] Fill in Create Project form:
  - [ ] Project Name: "Test Project"
  - [ ] Description: "This is a test project for CrowdTank"
  - [ ] Funding Goal: 10
  - [ ] Duration: 7
  - [ ] Project ID: 1
- [ ] Click "Create Project"
- [ ] MetaMask popup - click "Confirm"
- [ ] Success message appears
- [ ] Project appears in "All Projects" section

### Phase 10: Test Project Funding
- [ ] Click "Fund Project" on the project card
- [ ] Modal appears
- [ ] Enter Amount: 5
- [ ] Click "Fund Project"
- [ ] MetaMask popup - click "Confirm"
- [ ] Success message appears
- [ ] Balance decreases
- [ ] Project shows new raised amount

---

## TESTNET DEPLOYMENT (Sepolia)

### Phase 1: Get Sepolia ETH
- [ ] Visit https://www.alchemy.com/faucets/ethereum-sepolia
- [ ] Connect your wallet
- [ ] Click "Send Me ETH"
- [ ] Wait for transaction (1-5 minutes)
- [ ] Check balance in MetaMask

### Phase 2: Configure Environment
- [ ] Create `.env` file in project root
- [ ] Add:
  ```
  SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
  PRIVATE_KEY=your_private_key_without_0x
  ETHERSCAN_API_KEY=your_etherscan_api_key
  ```
- [ ] Get Infura key from https://infura.io (free)
- [ ] Get Etherscan key from https://etherscan.io/apis (free)
- [ ] **⚠️ NEVER commit .env file!**

### Phase 3: Deploy to Sepolia
- [ ] Terminal 1: Run `npx hardhat run scripts/deploy.js --network sepolia`
- [ ] Wait for transaction finalization (~1 minute)
- [ ] Output shows: "✅ CrowdTank deployed successfully!"
- [ ] **📝 Copy the Contract Address**
- [ ] Output shows Etherscan verification starting

### Phase 4: Verify on Etherscan
- [ ] Go to https://sepolia.etherscan.io
- [ ] Search for your contract address
- [ ] Contract should show "Contract" tag
- [ ] Click "Contract" tab to see verified source code

### Phase 5: Update Frontend Config
- [ ] Open `frontend/src/config.js`
- [ ] Update: `export const CONTRACT_ADDRESS = "0x..."`
- [ ] Update: `export const CHAIN_ID = 11155111` (Sepolia)
- [ ] Update: `export const CHAIN_NAME = "Sepolia Testnet"`
- [ ] Save file

### Phase 6: Configure MetaMask for Sepolia
- [ ] MetaMask → Settings → Networks
- [ ] Find "Sepolia" (may be already added)
- [ ] If not, add it:
  - [ ] Network name: `Sepolia`
  - [ ] RPC: `https://sepolia.infura.io/v3/`
  - [ ] Chain ID: `11155111`
- [ ] Click "Sepolia" to switch networks
- [ ] Verify balance shows your test ETH

### Phase 7: Start Frontend
- [ ] Open terminal in `frontend/` folder
- [ ] Run: `npm start`
- [ ] Browser opens at localhost:3000
- [ ] MetaMask should prompt to connect

### Phase 8: Test on Sepolia
- [ ] Connect wallet
- [ ] Create a project
- [ ] Verify transaction on Sepolia Etherscan
- [ ] Fund a project
- [ ] Verify transaction on Sepolia Etherscan

---

## PRODUCTION DEPLOYMENT (Frontend to Vercel)

### Phase 1: Prepare Frontend
- [ ] Code tested and working locally
- [ ] `frontend/src/config.js` has production contract address
- [ ] `CHAIN_ID` set to correct network (11155111 for Sepolia, 1 for Mainnet)
- [ ] No console errors in browser
- [ ] All environment variables configured

### Phase 2: Build for Production
- [ ] Terminal in `frontend/` folder
- [ ] Run: `npm run build`
- [ ] Build completes successfully
- [ ] `build/` folder created with all files
- [ ] No errors in build output

### Phase 3: Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign up or Log in
- [ ] Click "Import Project"
- [ ] Select your GitHub repository (or upload folder)
- [ ] Framework: React
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Add Environment Variables:
  - [ ] `REACT_APP_CONTRACT_ADDRESS`: Your contract address
  - [ ] `REACT_APP_CHAIN_ID`: 11155111 or 1
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Get your deployed URL

### Phase 4: Verify Deployment
- [ ] Visit your Vercel URL (e.g., myapp.vercel.app)
- [ ] Page loads correctly
- [ ] MetaMask connection works
- [ ] Can create/fund projects
- [ ] No console errors (F12)
- [ ] Transactions work properly

---

## POST-DEPLOYMENT VERIFICATION

### Smart Contract
- [ ] Contract deployed to correct network
- [ ] Contract verified on Etherscan (if testnet/mainnet)
- [ ] All functions callable
- [ ] Events emit correctly
- [ ] Gas usage reasonable

### Frontend
- [ ] Loads without errors
- [ ] Wallet connection works
- [ ] Project creation works
- [ ] Project funding works
- [ ] Withdrawals work (after deadline)
- [ ] Balance displays correctly
- [ ] Error messages are clear
- [ ] Responsive on mobile

### Integration
- [ ] Contract address matches in config
- [ ] Chain ID matches deployment network
- [ ] MetaMask connected to correct network
- [ ] All transactions appear on block explorer
- [ ] No missing imports or external dependencies

---

## TROUBLESHOOTING DURING DEPLOYMENT

### Port 8545 Already in Use
```
Windows: netstat -ano | findstr :8545
        taskkill /PID <PID> /F
Mac/Linux: lsof -i :8545
          kill -9 <PID>
```
Then restart Hardhat node

### npm install Fails
```
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### MetaMask Not Detecting Localhost
- [ ] Check RPC URL: http://127.0.0.1:8545 (not localhost)
- [ ] Check Chain ID: 31337
- [ ] Rebuild MetaMask network connection
- [ ] Restart MetaMask browser extension

### "Contract Address Not Configured"
- [ ] Check `frontend/src/config.js`
- [ ] Verify address is in quotes: `"0x..."`
- [ ] Verify no spaces or typos
- [ ] Restart frontend (`npm start`)

### Transaction Fails with "Insufficient Funds"
- [ ] Check MetaMask balance shows 10000 ETH (localhost)
- [ ] Check MetaMask is on Hardhat Localhost network
- [ ] Check correct account is selected in MetaMask

### Contract Compilation Fails
```bash
npx hardhat clean
npx hardhat compile
```

---

## Success Criteria

✅ **Local Deployment Success:**
- Hardhat node running without errors
- Contract deployed successfully
- Frontend running at localhost:3000
- Can create projects
- Can fund projects
- MetaMask connected and working

✅ **Testnet Deployment Success:**
- Contract deployed to Sepolia
- Verified on Etherscan
- Frontend accessible at custom URL
- All functions working on testnet
- Transactions visible on Etherscan

✅ **Production Deployment Success:**
- Frontend deployed to Vercel/Netlify
- Custom domain configured (optional)
- SSL certificate active
- All features working
- No console errors in production

---

## Next Steps After Deployment

1. **Share the URL** with users
2. **Test all features** thoroughly
3. **Monitor gas costs** on transactions
4. **Gather feedback** from beta testers
5. **Fix bugs** reported by users
6. **Plan mainnet deployment** (if going live with real funds)

---

## Emergency Contacts & Resources

- **Hardhat Docs:** https://hardhat.org/doc
- **Ethers.js Docs:** https://docs.ethers.org/v5/
- **MetaMask Help:** https://support.metamask.io
- **Sepolia Faucet:** https://www.alchemy.com/faucets
- **Sepolia Etherscan:** https://sepolia.etherscan.io

---

**Document Version:** 1.0
**Last Updated:** April 2026
**CrowdTank Version:** 1.0.0

---

## Sign-Off

- [ ] All items checked
- [ ] Deployment completed successfully
- [ ] Testing completed
- [ ] Ready for production use

**Date Deployed:** ___________
**Deployed By:** ___________
**Network:** ___________
**Contract Address:** ___________
