# CrowdTank Troubleshooting Guide

## ❌ Common Errors and Solutions

### Error 1: "network does not support ENS"
**Error Message:**
```
Error creating project: network does not support ENS 
(operation="getResolver", network="unknown", ...)
```

**Cause:** 
- The contract address is invalid or not set
- The Hardhat node is not running
- Network configuration is incorrect

**Solution:**
1. Make sure Hardhat node is running:
   ```bash
   npx hardhat node
   ```

2. Deploy the contract to get a valid address:
   ```bash
   npx hardhat run scripts/test-deploy.js --network localhost
   ```

3. Copy the contract address from the output

4. Update `scripts/interact.js` or set environment variable:
   ```bash
   # Windows CMD
   set CONTRACT_ADDRESS=0x...
   npx hardhat run scripts/interact.js --network localhost
   
   # Windows PowerShell
   $env:CONTRACT_ADDRESS='0x...'
   npx hardhat run scripts/interact.js --network localhost
   
   # Mac/Linux
   export CONTRACT_ADDRESS=0x...
   npx hardhat run scripts/interact.js --network localhost
   ```

---

### Error 2: "Contract not found at address"
**Error Message:**
```
Error: Could not load contract at address: 0x...
Make sure the address is correct and the contract is deployed.
```

**Cause:**
- The contract address is wrong
- The contract hasn't been deployed
- You're pointing to the wrong network

**Solution:**
1. Verify Hardhat node is running on the correct network:
   ```bash
   npx hardhat node
   ```
   Should show: `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`

2. Deploy the contract:
   ```bash
   npx hardhat run scripts/test-deploy.js --network localhost
   ```

3. Use the contract address from the deployment output

---

### Error 3: "Cannot find module 'ethers'"
**Error Message:**
```
Error: Cannot find module 'ethers'
```

**Cause:**
- Dependencies not installed
- Node modules deleted

**Solution:**
```bash
# Install all dependencies
npm install

# Or reinstall from scratch
rm -rf node_modules package-lock.json
npm install
```

---

### Error 4: Frontend shows "Contract address is 0x0"
**Error Message:**
- Frontend won't connect to contract
- All buttons greyed out or showing errors

**Cause:**
- Contract address not updated in frontend config
- Environment variable not set

**Solution:**
1. Deploy the contract:
   ```bash
   npx hardhat run scripts/test-deploy.js --network localhost
   ```

2. Copy the contract address

3. Update `frontend/src/config.js`:
   ```javascript
   export const CONTRACT_ADDRESS = "0x..."; // Paste your address here
   ```

4. Or set environment variable before starting frontend:
   ```bash
   # Windows CMD
   set REACT_APP_CONTRACT_ADDRESS=0x...
   npm start
   
   # Windows PowerShell
   $env:REACT_APP_CONTRACT_ADDRESS='0x...'
   npm start
   
   # Mac/Linux
   export REACT_APP_CONTRACT_ADDRESS=0x...
   npm start
   ```

---

### Error 5: MetaMask Connection Issues
**Problem:**
- MetaMask won't connect
- "User rejected provider access"
- Network mismatch errors

**Solution:**
1. Make sure MetaMask is installed:
   - Visit https://metamask.io/

2. Add Hardhat network to MetaMask:
   - Network Name: `Hardhat`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

3. Import test account to MetaMask:
   - Get private key from `npx hardhat node` output
   - In MetaMask: Account > Import Account > Paste private key

4. Refresh the frontend and try connecting again

---

### Error 6: "Insufficient funds"
**Error Message:**
```
Error: insufficient funds for gas
```

**Cause:**
- Account doesn't have ETH for gas fees
- Using a real testnet without faucet ETH

**Solution:**

**For Hardhat Localhost:**
- Use one of the test accounts from `npx hardhat node`
- They come with 10,000 ETH each
- Simply import one to MetaMask

**For Sepolia Testnet:**
```
Get free test ETH from:
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://www.infura.io/faucet/sepolia
- https://sepoliafaucet.com/
```

---

### Error 7: "Project does not exist"
**Error Message:**
```
Error: Project does not exist
```

**Cause:**
- Project ID hasn't been created yet
- Using wrong project ID
- Project was created on different network/deployment

**Solution:**
1. Create a project first:
   - Using frontend: "Create Project" button
   - Or using script: `npx hardhat run scripts/test-deploy.js --network localhost`

2. Make sure you're using the correct project ID (should be 1 for first project)

3. Check that it's the same network/deployment

---

### Error 8: Tests Keep Failing
**Problem:**
```
npm test - some tests fail
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test test/CrowdTank.test.js
```

---

## 🔧 Step-by-Step Troubleshooting

### For Local Development (Hardhat)

**Terminal 1 - Start Blockchain:**
```bash
cd d:\PROJECTS\CROWDTANK
npx hardhat node
```
✅ Should show: "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

**Terminal 2 - Deploy Contract:**
```bash
cd d:\PROJECTS\CROWDTANK
npx hardhat run scripts/test-deploy.js --network localhost
```
✅ Should show contract address and test results

**Terminal 3 - Run Interaction Script:**
```bash
cd d:\PROJECTS\CROWDTANK
set CONTRACT_ADDRESS=0x... (copy from Terminal 2 output)
npx hardhat run scripts/interact.js --network localhost
```
✅ Should complete without errors

**Terminal 4 - Start Frontend:**
```bash
cd d:\PROJECTS\CROWDTANK\frontend
npm install
```
Edit `src/config.js` and update CONTRACT_ADDRESS with address from Terminal 2
```bash
npm start
```
✅ Should open http://localhost:3000

---

## 📋 Verification Checklist

- [ ] Hardhat node is running (Terminal 1)
- [ ] Contract deployed successfully (Terminal 2)
- [ ] Contract address copied
- [ ] `CONTRACT_ADDRESS` environment variable set or config updated
- [ ] Interact script ran without errors (Terminal 3)
- [ ] Frontend config updated with contract address
- [ ] Frontend running on http://localhost:3000 (Terminal 4)
- [ ] MetaMask connected to Hardhat network
- [ ] MetaMask switched to imported test account
- [ ] Frontend shows "Connect Wallet" button
- [ ] Can click "Create Project" and form appears
- [ ] Can sign transactions in MetaMask

---

## 🆘 Still Having Issues?

1. **Check browser console (F12)** for error messages
2. **Check Terminal output** for detailed errors
3. **Restart everything** in this order:
   - Stop all terminals (Ctrl+C)
   - Start Hardhat node again
   - Redeploy contract
   - Restart frontend
4. **Verify network** - Make sure all terminals are using `--network localhost`
5. **Check contract address** - Must be a valid 0x address (42 characters)

---

## 🔗 Useful Commands

```bash
# Check if Hardhat is installed
npx hardhat --version

# List all accounts
npx hardhat accounts --network localhost

# Compile contracts
npx hardhat compile

# Run tests
npm test

# Deploy to localhost
npx hardhat run scripts/test-deploy.js --network localhost

# Interact with contract
npx hardhat run scripts/interact.js --network localhost

# Reset everything
rm -rf artifacts cache node_modules
npm install
```

---

## 📞 Quick Help

| Issue | Command |
|-------|---------|
| Want to restart? | `Ctrl+C` to stop, then `npx hardhat node` to restart |
| Need contract address? | `npx hardhat run scripts/test-deploy.js --network localhost` |
| Want to test contract? | `npm test` |
| Frontend won't load? | Check browser console (F12), update CONTRACT_ADDRESS |
| MetaMask issues? | Add Hardhat network manually, import test account |

---

**If all else fails:** Delete everything and start fresh:
```bash
# Remove all artifacts
rm -rf artifacts cache node_modules

# Clean install
npm install

# Start from scratch
npx hardhat node
```

Then follow the main README.md steps again.
