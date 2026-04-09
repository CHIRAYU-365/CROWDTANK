# 📋 CrowdTank Deployment Options Guide

**Complete reference for all deployment methods and scripts.**

---

## Quick Summary

| Method | Complexity | Auto-Config | Time | Best For |
|--------|-----------|-----------|------|----------|
| **Concurrent Deploy** | ⭐ Easy | ✅ Yes | 2-3 min | First-time setup |
| **Interactive Menu** | ⭐ Easy | ✅ Yes | 2-3 min | Decision-making |
| **npm Scripts** | ⭐⭐ Medium | ✅ Yes | Custom | Flexibility |
| **Manual** | ⭐⭐⭐ Hard | ❌ No | 5-10 min | Full control |
| **Netlify** | ⭐⭐ Medium | ✅ Yes | 5-10 min | Production |

---

## 🚀 Option 1: Concurrent Deploy (RECOMMENDED)

**One command launches everything simultaneously.**

### Windows
```bash
concurrent-deploy.bat           # localhost
concurrent-deploy.bat sepolia   # Sepolia testnet
concurrent-deploy.ps1           # PowerShell version
```

### macOS / Linux
```bash
./concurrent-deploy.sh          # localhost
./concurrent-deploy.sh sepolia  # Sepolia testnet
```

### What It Does
```
Terminal 1: Hardhat node
Terminal 2: React frontend
Main window: Orchestration & address auto-configuration
```

### Features
✅ Launches multiple terminals automatically
✅ Captures contract address from deployment
✅ Updates `frontend/src/config.js` automatically
✅ Opens browser at `http://localhost:3000`
✅ Shows real-time progress
✅ Handles all errors gracefully

### Result
```
✅ All services running
✅ Contract address configured
✅ Browser open on localhost:3000
✅ Ready to test
```

---

## 🎛️ Option 2: Interactive Menu

**Visual menu lets you choose your deployment path.**

### Windows
```bash
deploy-menu.bat
```

### Features
```
[1] Deploy Locally (Concurrent) ✅
[2] Deploy Sepolia (Concurrent) ✅
[3] Manual Localhost
[4] Manual Sepolia
[5] Compile Only
[6] Run Tests Only
[7] Hardhat Node Only
[8] Frontend Only
[9] View Documentation
[0] Exit
```

### Use Cases
- First-time users (guidance)
- Multiple deployment options
- Testing different scenarios
- Learning the process

### Example Workflow
```
Menu → [1] Deploy Locally
Wait for all terminals to launch
Browser opens to http://localhost:3000
Test the app
Exit menu with [0]
```

---

## 📦 Option 3: npm Scripts

**Flexible npm commands for each operation.**

### Available Commands
```bash
npm run deploy:concurrent           # Localhost concurrent
npm run deploy:concurrent:sepolia   # Sepolia concurrent
npm run deploy:localhost            # Localhost only
npm run deploy:sepolia              # Sepolia only
npm test                            # Run tests
npm run node                        # Start Hardhat node
npm run compile                     # Compile contracts
npm run clean                       # Clean artifacts
```

### Examples

**Complete localhost deployment:**
```bash
npm run deploy:concurrent
# Launches everything
```

**Sepolia deployment:**
```bash
npm run deploy:concurrent:sepolia
# Needs .env with SEPOLIA_RPC and PRIVATE_KEY
```

**Just compile:**
```bash
npm run compile
# Checks syntax, creates artifacts
```

**Just test:**
```bash
npm test
# Runs full test suite
```

**Just node:**
```bash
npm run node
# Hardhat node for manual deploys
```

---

## 🛠️ Option 4: Node.js Direct

**Direct Node.js execution without npm scripts.**

```bash
node scripts/concurrent-deploy.js localhost
node scripts/concurrent-deploy.js sepolia
```

### Features
- Pure Node.js, no npm wrapper
- Full control over environment
- Best for CI/CD pipelines
- Scriptable with bash/batch

### Combined with bash
```bash
#!/bin/bash
cd /path/to/crowdtank
node scripts/concurrent-deploy.js localhost
```

---

## ⚙️ Option 5: Manual Deployment (Full Control)

**Launch each component individually in separate terminals.**

### Step 1: Terminal 1 - Hardhat Node
```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK
npx hardhat node
```

### Step 2: Terminal 2 - Deploy Contract
```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK
npx hardhat run scripts/deploy.js --network localhost
# Save the contract address
```

### Step 3: Update Config
Edit `frontend/src/config.js`:
```javascript
export const CONTRACT_ADDRESS = "0x5FbDB...";  // Your address
export const CHAIN_ID = 31337;
export const CHAIN_NAME = "Hardhat (Localhost)";
```

### Step 4: Terminal 3 - Frontend
```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK\frontend
npm start
```

### When to Use
- Debugging deployment issues
- Understanding the process
- Custom network configuration
- CI/CD with separate stages

---

## 🌐 Option 6: Netlify Deployment

**Deploy frontend to production cloud.**

See: **NETLIFY_DEPLOYMENT.md** for complete steps.

### Quick Summary
```
1. Deploy contract to Sepolia/Mainnet
2. Update frontend config with contract address
3. Push to GitHub
4. Connect to Netlify
5. Auto-deploy on every push
```

### Result
```
Frontend: https://crowdtank-xyz.netlify.app
Backend: Deployed to blockchain
Auto-updates on git push
```

---

## Comparison Matrix

| Feature | Concurrent | Menu | npm | Node | Manual | Netlify |
|---------|-----------|------|-----|------|--------|---------|
| **Auto-config** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Auto-terminal** | ✅ | ✅ | ❌ | ❌ | ❌ | N/A |
| **Time** | 2-3 min | 2-3 min | 2-3 min | 5+ min | 10+ min | 5-10 min |
| **Learning** | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Control** | ⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Production** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Network-Specific Setup

### Localhost (Default)
```bash
# Prerequisites
- Node.js v16+
- npm v8+
- Port 8545 free

# Deploy
npm run deploy:concurrent

# Result
✅ Hardhat node
✅ Smart contract
✅ React frontend
```

### Sepolia Testnet
```bash
# Prerequisites
- All localhost requirements +
- .env file with:
  SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
  PRIVATE_KEY=your_wallet_key
- Sepolia ETH from faucet

# Deploy
npm run deploy:concurrent:sepolia

# Result
✅ Contract on Sepolia
✅ Frontend configured
✅ 30-60 sec transaction confirmation
```

### Mainnet (Production)
```bash
# Prerequisites
- All Sepolia requirements +
- Real ETH for gas fees
- Fresh/dedicated private key
- Professional audit recommended

# Deploy (CAREFUL!)
node scripts/concurrent-deploy.js mainnet

# Result
✅ Contract on Ethereum Mainnet
✅ Permanent deployment
⚠️ Gas fees in real ETH
```

---

## Troubleshooting by Method

### Concurrent Deploy Issues

| Issue | Fix |
|-------|-----|
| Port 8545 in use | Kill: `taskkill /F /IM node.exe` |
| Contract address blank | Check Terminal 2 output |
| Config not updating | Check file permissions |
| Browser won't open | Open manually: `http://localhost:3000` |

### Menu Issues

| Issue | Fix |
|-------|-----|
| Menu won't display | Run: `deploy-menu.bat` (not `.bat "argument"`) |
| Invalid option | Enter 0-9 only |
| Terminal closes | Menu auto loops, select another option |

### npm Scripts Issues

| Issue | Fix |
|-------|-----|
| Command not found | Run: `npm install` first |
| Port in use | Restart terminal, kill process |
| .env missing | Create `.env.example` copy as `.env` |

### Manual Issues

| Issue | Fix |
|-------|-----|
| Multiple steps | Follow numbered instructions in order |
| Address not saved | Write it down before closing terminal |
| Forgot to update config | Contract won't work, update and refresh |

---

## Best Practices

### For First-Time Setup
✅ Use **Concurrent Deploy**
✅ Recommended: `npm run deploy:concurrent`
✅ Let it handle everything automatically

### For Learning & Understanding
✅ Use **Manual** method once to see process
✅ Use **Menu** for next deployments
✅ Understand before automating

### For Development Workflow
✅ Use **npm scripts** for consistency
✅ Keep Hardhat node running: `npm run node`
✅ Deploy when ready: `npm run deploy:localhost`
✅ Frontend watches changes: `cd frontend && npm start`

### For CI/CD Pipelines
✅ Use **Node.js direct** script
✅ Capture output to logs
✅ Parse contract address programmatically
✅ Exit with proper error codes

### For Production
✅ Use **Netlify** for frontend
✅ Deploy contract separately to Mainnet
✅ Verify on Etherscan
✅ Use different .env per network

---

## Environment Variables

### .env Required for Sepolia/Mainnet

```env
# Infura endpoint (for reading blockchain state)
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# Your wallet private key for signing transactions
PRIVATE_KEY=your_hex_private_key_here

# Optional: For contract verification on Etherscan
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Get These Keys

| Key | Where | How |
|-----|-------|-----|
| **INFURA_KEY** | https://infura.io | Create new project → Ethereum → Sepolia |
| **PRIVATE_KEY** | MetaMask | Settings → Security → Export Private Key |
| **ETHERSCAN_KEY** | https://etherscan.io/apis | Create API key (Optional) |

### .env NOT Needed for Localhost
✅ Hardhat provides test private keys
✅ No network access to external RPC
✅ Works out of the box

---

## Script Source Files

| Script | Type | Location | Purpose |
|--------|------|----------|---------|
| concurrent-deploy.js | JavaScript | `scripts/` | Node.js orchestrator |
| concurrent-deploy.bat | Batch | Root | Windows launcher |
| concurrent-deploy.ps1 | PowerShell | Root | Windows alt launcher |
| concurrent-deploy.sh | Bash | Root | Unix/Mac launcher |
| deploy-menu.bat | Batch | Root | Interactive menu |

### View Script Source
```bash
# See what concurrent-deploy.js does
cat scripts/concurrent-deploy.js

# See what batch wrapper does
type concurrent-deploy.bat

# See what shell script does
cat concurrent-deploy.sh
```

---

## Performance Timing

### Concurrent Deploy (Localhost)
```
Pre-check:        ~2 seconds
Hardhat launch:   ~3 seconds
Node startup:     ~10 seconds
Contract deploy:  ~15 seconds
Config update:    ~1 second
Frontend launch:  ~30 seconds
Browser open:     ~2 seconds
────────────────────────
Total:            ~2-3 minutes
```

### Concurrent Deploy (Sepolia)
```
Pre-check:        ~2 seconds
Node startup:     ~15 seconds
Contract deploy:  ~30-60 seconds (waiting for confirmation)
Config update:    ~1 second
Frontend launch:  ~30 seconds
────────────────────────
Total:            ~3-5 minutes
```

---

## Automation & Integration

### GitHub Actions

```yaml
- name: Deploy to localhost
  run: npm run deploy:concurrent
```

### Docker Compose

```yaml
services:
  deploy:
    image: node:16
    command: npm run deploy:concurrent:sepolia
```

### CI/CD Pipeline

```bash
#!/bin/bash
set -e

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Deploy
npm run deploy:concurrent:sepolia

# Run tests
npm test

# Build frontend
cd frontend && npm run build
```

---

## Rollback & Cleanup

### Kill All Node Processes
```bash
# Windows
taskkill /F /IM node.exe

# macOS/Linux
pkill node

# Specific port (Windows)
netstat -ano | findstr :8545
taskkill /PID <PID> /F
```

### Reset Frontend Config (Back to Example)
```bash
# Revert changes to config.js
git checkout frontend/src/config.js

# Or manually edit and set to:
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```

### Clean Build Artifacts
```bash
npm run clean
```

---

## Next Steps

### After Successful Deployment

1. ✅ **Access the app**
   ```
   http://localhost:3000
   ```

2. ✅ **Connect wallet**
   - Open MetaMask
   - Switch to Hardhat Localhost (or Sepolia)
   - Click Connect

3. ✅ **Test functionality**
   - Create a project
   - Fund a project
   - Test withdrawals

4. ✅ **Check logs**
   - Monitor Hardhat node terminal
   - Check browser console (F12)

5. ✅ **Deploy to production**
   - See NETLIFY_DEPLOYMENT.md when ready
   - Use Sepolia first for testing

---

## Documentation

| Document | Purpose |
|----------|---------|
| **CONCURRENT_DEPLOYMENT.md** | Complete concurrent deploy guide |
| **CONCURRENT_DEPLOYMENT_QUICK_CARD.md** | Quick reference |
| **DEPLOYMENT_OPTIONS_GUIDE.md** | This file - all options |
| **NETLIFY_DEPLOYMENT.md** | Cloud deployment |
| **DEPLOYMENT.md** | Smart contract deployment details |
| **FRONTEND_SETUP.md** | Frontend configuration |
| **README.md** | Project overview |

---

## Summary

```
┌─────────────────────────────────────────┐
│  Choose Your Deployment Method          │
├─────────────────────────────────────────┤
│ First time?        → npm run deploy     │
│ Want to choose?    → deploy-menu.bat    │
│ Full automation?   → concurrent-deploy  │
│ Custom setup?      → Manual steps       │
│ Production?        → NETLIFY_DEPLOYMENT │
│ Learning?          → Manual + menu      │
└─────────────────────────────────────────┘
```

---

## Need Help?

- **Quick Q**: Check Quick Card (30 seconds)
- **How does it work?**: Read CONCURRENT_DEPLOYMENT.md
- **Specific issue?**: Troubleshooting sections above
- **Want production?**: NETLIFY_DEPLOYMENT.md
- **Script details?**: Read scripts/concurrent-deploy.js

---

**Made with ❤️ for CrowdTank**

Last Updated: April 2026
Version: 1.0
Status: ✅ Production Ready
