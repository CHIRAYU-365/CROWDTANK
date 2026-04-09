# 🎯 Getting Started with CrowdTank

**Choose your path based on your goal!**

---

## 🚀 I Just Want to Run It (5 minutes)

### Start Here: Automated Setup

```bash
# 1. Install dependencies (5 min, one-time)
npm install && cd frontend && npm install && cd ..

# 2. Run everything automatically (2-3 min)
npm run deploy:concurrent

# 3. Done! Browser opens to http://localhost:3000
```

**What just happened:**
- ✅ Hardhat node started in Terminal 1
- ✅ Smart contract deployed in Terminal 2
- ✅ Frontend started in Terminal 3
- ✅ Contract address auto-configured
- ✅ Browser opened

**Next:** Connect MetaMask and test the app!

---

## 📚 I Want to Understand How It Works (30 minutes)

### Read These in Order

**5 min:** Quick overview
- [CONCURRENT_DEPLOYMENT_QUICK_CARD.md](CONCURRENT_DEPLOYMENT_QUICK_CARD.md)

**10 min:** How everything connects
- [CONCURRENT_DEPLOYMENT_SYSTEM.md](CONCURRENT_DEPLOYMENT_SYSTEM.md)

**15 min:** Complete technical guide
- [CONCURRENT_DEPLOYMENT.md](CONCURRENT_DEPLOYMENT.md)

**Optional:** All deployment options
- [DEPLOYMENT_OPTIONS_GUIDE.md](DEPLOYMENT_OPTIONS_GUIDE.md)

---

## ⛓️ I'm Deploying to Blockchain (30-60 minutes)

### For Sepolia Testnet

**Step 1: Setup (5 min)**
```bash
# Get free test ETH from:
# https://www.alchemy.com/faucets/ethereum-sepolia

# Create .env file:
cat > .env << EOF
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
EOF

# Get keys from:
# - Infura: https://infura.io
# - Wallet: MetaMask → Settings → Security
# - Etherscan: https://etherscan.io/apis (optional)
```

**Step 2: Deploy (2-3 min)**
```bash
npm run deploy:concurrent:sepolia
```

**Step 3: Verify (5 min)**
1. Open http://localhost:3000
2. Connect MetaMask (Sepolia network)
3. Test creating/funding projects
4. Transactions appear on https://sepolia.etherscan.io

**See:** [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps.

---

## 🌐 I'm Deploying to Production/Netlify (1-2 hours)

### Complete Production Deployment Guide

See: **[NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)**

**Overview:**
1. Deploy smart contract to Sepolia (30 min)
2. Test thoroughly (30 min)
3. Deploy frontend to Netlify (20 min)
4. Configure custom domain (optional, 15 min)
5. Set up monitoring (optional, 20 min)

**Result:** Live app on internet with automatic updates!

---

## 🔍 I Have a Specific Problem

| Problem | Solution |
|---------|----------|
| **"Port 8545 in use"** | Kill: `taskkill /F /IM node.exe` |
| **"MetaMask won't connect"** | Install MetaMask → Switch to Hardhat Localhost (31337) |
| **"Contract address error"** | Check: `grep CONTRACT_ADDRESS frontend/src/config.js` |
| **"Insufficient funds (Sepolia)"** | Get free ETH: https://www.alchemy.com/faucets/ethereum-sepolia |
| **"Build failed"** | Run: `npm install && npm run compile` |
| **Can't find contract"** | Verify on Etherscan: https://sepolia.etherscan.io |

**See:** Troubleshooting sections in:
- [CONCURRENT_DEPLOYMENT.md](CONCURRENT_DEPLOYMENT.md#troubleshooting)
- [DEPLOYMENT_OPTIONS_GUIDE.md](DEPLOYMENT_OPTIONS_GUIDE.md#troubleshooting-by-method)
- [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md#troubleshooting)

---

## 🛠️ I'm a Developer/Contributor

### For Development

**Setup:**
```bash
npm install
npm run deploy:concurrent          # Localhost
npm run node                       # Just Hardhat node for manual deploys
npm test                          # Run full test suite
npm run compile                   # Check contracts
```

**Workflow:**
1. Make code changes
2. React auto-reloads (frontend)
3. Test in browser
4. Check Hardhat terminal for logs
5. Git push to auto-deploy to Netlify

**Files to understand:**
- Smart contract: [contracts/CrowdTank.sol](contracts/CrowdTank.sol)
- Frontend state: [frontend/src/App.jsx](frontend/src/App.jsx)
- Contract interaction: [frontend/src/utils/contractInteraction.js](frontend/src/utils/contractInteraction.js)
- Configuration: [frontend/src/config.js](frontend/src/config.js)

**See:** [README.md](README.md) for complete architecture.

---

## 📋 All Available Commands

### Installation
```bash
npm install                    # Install backend dependencies
cd frontend && npm install     # Install frontend dependencies
```

### Deployment
```bash
npm run deploy:concurrent              # Auto localhost setup
npm run deploy:concurrent:sepolia      # Auto Sepolia setup
npm run deploy:localhost               # Just contract deploy on localhost
npm run deploy:sepolia                 # Just contract deploy on Sepolia
```

### Development
```bash
npm run node                   # Start Hardhat node only
npm test                       # Run all tests
npm run compile               # Compile contracts
npm run clean                 # Clean build artifacts
```

### Frontend
```bash
cd frontend && npm start      # Start dev server (localhost:3000)
cd frontend && npm run build  # Production build
cd frontend && npm run test   # Frontend tests
```

### Menu (Windows)
```bash
deploy-menu.bat              # Interactive deployment menu
concurrent-deploy.bat        # Batch launcher
concurrent-deploy.ps1        # PowerShell launcher
```

### Bash (macOS/Linux)
```bash
./concurrent-deploy.sh       # Unix launcher
```

---

## 📚 Documentation Index

### Quick Start
| Document | Time | Purpose |
|----------|------|---------|
| [CONCURRENT_DEPLOYMENT_QUICK_CARD.md](CONCURRENT_DEPLOYMENT_QUICK_CARD.md) | 2 min | One-page quick ref |
| [This file](GETTING_STARTED.md) | 5 min | Path finder (you are here) |

### Detailed Guides
| Document | Time | Purpose |
|----------|------|---------|
| [CONCURRENT_DEPLOYMENT_SYSTEM.md](CONCURRENT_DEPLOYMENT_SYSTEM.md) | 20 min | How it all works |
| [CONCURRENT_DEPLOYMENT.md](CONCURRENT_DEPLOYMENT.md) | 30 min | Complete technical guide |
| [DEPLOYMENT_OPTIONS_GUIDE.md](DEPLOYMENT_OPTIONS_GUIDE.md) | 20 min | All deployment methods |

### Network-Specific
| Document | Network | Purpose |
|----------|---------|---------|
| [README.md](README.md) | All | Full project overview |
| [DEPLOYMENT.md](DEPLOYMENT.md) | All | Contract deployment details |
| [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) | Production | Cloud hosting guide |

### Reference
| Document | Purpose |
|----------|---------|
| [FRONTEND_SETUP.md](FRONTEND_SETUP.md) | Frontend configuration |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Step-by-step checklist |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues |

---

## 🎯 Quick Decision Tree

```
Start Here: "What do I want to do?"

├─ I just want to run it locally
│  └→ npm run deploy:concurrent
│     └→ Open http://localhost:3000
│

├─ I want to understand the code
│  └→ Read README.md (full overview)
│     └→ Read CONCURRENT_DEPLOYMENT_SYSTEM.md (how it works)
│

├─ I'm deploying to testnet (Sepolia)
│  └→ Create .env with SEPOLIA_RPC + PRIVATE_KEY
│     └→ npm run deploy:concurrent:sepolia
│     └→ Test on https://sepolia.etherscan.io
│

├─ I'm deploying to production (Mainnet)
│  └→ See NETLIFY_DEPLOYMENT.md
│     └→ Smart contract on mainnet
│     └→ Frontend on Netlify
│     └→ Custom domain setup
│

├─ I'm debugging an issue
│  └→ Check DEPLOYMENT_OPTIONS_GUIDE.md#troubleshooting
│     └→ Or CONCURRENT_DEPLOYMENT.md#troubleshooting
│     └→ Or NETLIFY_DEPLOYMENT.md#troubleshooting
│

└─ I'm contributing code
   └→ Follow CONTRIBUTING.md (in README.md)
      └→ Use npm run deploy:concurrent for testing
      └→ Run npm test before committing
```

---

## ✨ Features Overview

### Smart Contract
- ✅ Create crowdfunding projects
- ✅ Fund projects with ETH
- ✅ Refund if project fails
- ✅ Creator claims if project succeeds
- ✅ Reentrancy-protected
- ✅ 50+ test cases

### Frontend
- ✅ MetaMask wallet connection
- ✅ Create projects (form validation)
- ✅ Fund projects (amount validation)
- ✅ View project details & progress
- ✅ Withdraw funds / claim funds
- ✅ Real-time balance updates
- ✅ Error handling with helpful messages

### Deployment
- ✅ One-command automated setup
- ✅ Auto-feeds contract address
- ✅ Multiple network support (localhost, Sepolia, Mainnet)
- ✅ Cloud hosting ready (Netlify)
- ✅ Cross-platform (Windows, Mac, Linux)

---

## 🆘 Need More Help?

| Need | Resource | Time |
|------|----------|------|
| Quick answer | QUICK_CARD.md | 2 min |
| How to deploy | DEPLOYMENT.md | 10 min |
| Troubleshoot | Troubleshooting sections | 5-10 min |
| Complete guide | README.md | 30 min |
| Cloud deployment | NETLIFY_DEPLOYMENT.md | 60 min |

---

## 🎓 Learning Path

### Beginner
1. Run: `npm run deploy:concurrent` ✅
2. Test in browser
3. Read: CONCURRENT_DEPLOYMENT_QUICK_CARD.md
4. Create a test project

### Intermediate
1. Read: CONCURRENT_DEPLOYMENT_SYSTEM.md
2. Understand: How address flows
3. Read: contracts/CrowdTank.sol
4. Modify: Create a new project

### Advanced
1. Read: DEPLOYMENT_OPTIONS_GUIDE.md
2. Deploy to Sepolia
3. Deploy to Netlify
4. Fork and modify
5. Deploy to Mainnet (with audit)

---

## 🚀 Next Steps

### Right Now
```bash
npm run deploy:concurrent
# Wait for browser to open
# Connect MetaMask
# Create a test project!
```

### In 10 Minutes
- Test funding a project
- Test withdrawals
- Check Hardhat terminal for logs
- Read CONCURRENT_DEPLOYMENT_QUICK_CARD.md

### In 1 Hour
- Deploy to Sepolia
- See guide: [DEPLOYMENT.md](DEPLOYMENT.md)

### In 1 Day
- Deploy to Netlify
- See guide: [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)

### In 1 Week
- Professional security audit
- Deploy to Mainnet
- Setup monitoring & alerts

---

## 📞 Still Stuck?

1. **Check:** DEPLOYMENT_OPTIONS_GUIDE.md troubleshooting
2. **Search:** All .md files for your error message
3. **Try:** Clear cache and rebuild
   ```bash
   npm run clean
   npm install
   npm run deploy:concurrent
   ```
4. **Ask:** Open GitHub issue with full error message

---

**Welcome to CrowdTank! 🎉**

*Pick a path above and enjoy the process!*

Made with ❤️ for developers like you.

Last updated: April 2026
