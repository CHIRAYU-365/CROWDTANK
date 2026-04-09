# 🚀 Netlify Deployment Quick Card

**Print or bookmark this for quick reference!**

---

## 5-Minute Quick Start

### Prerequisites ✅
- Node.js v16+, npm v8+, Git installed
- GitHub account, Netlify account (free)
- Sepolia ETH from [faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- Infura key from [infura.io](https://infura.io)

---

## PHASE 1: Deploy Contract (5-10 min)

### 1. Create `.env` file
```
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 2. Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
📝 **Copy contract address!**

### 3. Update Frontend Config
Edit `frontend/src/config.js`:
```javascript
export const CONTRACT_ADDRESS = "0x..."; // Your address
export const CHAIN_ID = 11155111; // Sepolia
```

---

## PHASE 2: Prepare & Build (2-5 min)

### 1. Local Build Test
```bash
cd frontend && npm install && npm run build
```

### 2. Create netlify.toml
```toml
[build]
command = "cd frontend && npm install && npm run build"
publish = "frontend/build"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### 3. Push to GitHub
```bash
git add . && git commit -m "Deploy ready" && git push
```

---

## PHASE 3: Deploy to Netlify (5 min)

### 1. Connect GitHub
- https://app.netlify.com
- Click "Add new site" → "Import existing project"
- Select your GitHub repo

### 2. Configure Build
```
Build command: cd frontend && npm install && npm run build
Publish dir: frontend/build
```
(Should auto-populate from netlify.toml)

### 3. Add Environment Variables
```
CONTRACT_ADDRESS = 0x...
REACT_APP_CONTRACT_ADDRESS = 0x...
CHAIN_ID = 11155111
REACT_APP_CHAIN_ID = 11155111
```

### 4. Click "Deploy"
⏱️ Wait 3-5 minutes for build & deployment

---

## PHASE 4: Verify (5 min)

### Test Checklist
- [ ] Site loads at `https://crowdtank-xxx.netlify.app`
- [ ] MetaMask connects (Sepolia network)
- [ ] Can create project
- [ ] Can fund project
- [ ] Transactions appear on Etherscan
- [ ] No console errors (F12)

### Live Links
- 🌐 **Your Site**: https://crowdtank-xxx.netlify.app
- 📊 **Explorer**: https://sepolia.etherscan.io
- 🔧 **Netlify Dashboard**: https://app.netlify.com

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| **Build fails** | Check `netlify.toml` exists, `npm install` works locally |
| **MetaMask won't connect** | Install MetaMask extension, switch to Sepolia network |
| **Contract address error** | Verify on Etherscan, update config.js, redeploy |
| **Insufficient funds** | Get free Sepolia ETH from faucet |
| **Wrong network** | MetaMask → Switch to Sepolia (11155111) |
| **Blank page** | Add React redirect to netlify.toml, wait 3 min |

---

## Update Your Site

**Auto Deployment** ✅
```bash
git push origin main
# Netlify auto-deploys in 3-5 minutes
```

---

## Full Guide
See: **NETLIFY_DEPLOYMENT.md** for complete step-by-step instructions with detailed explanations, troubleshooting, and security best practices.

---

**Made with ❤️ for CrowdTank**
