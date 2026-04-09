# 🚀 CrowdTank Netlify Deployment Guide

Complete step-by-step guide to deploy CrowdTank frontend to **Netlify** (with smart contract on Sepolia or Mainnet).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Smart Contract Deployment](#phase-1-smart-contract-deployment)
3. [Phase 2: Frontend Preparation](#phase-2-frontend-preparation)
4. [Phase 3: Netlify Account Setup](#phase-3-netlify-account-setup)
5. [Phase 4: Deploy to Netlify](#phase-4-deploy-to-netlify)
6. [Phase 5: Verification & Testing](#phase-5-verification--testing)
7. [Troubleshooting](#troubleshooting)
8. [Post-Deployment](#post-deployment)

---

## 📋 Prerequisites

Before deploying to Netlify, you'll need:

### Software & Tools
- ✅ Node.js v16+ (`node --version`)
- ✅ npm v8+ (`npm --version`)
- ✅ Git installed and configured
- ✅ GitHub account (for linking to Netlify)
- ✅ MetaMask wallet with ETH
- ✅ Text editor (VS Code recommended)

### Accounts & Keys
- ✅ **GitHub account** - to push code
- ✅ **Netlify account** - free tier available at [netlify.com](https://netlify.com)
- ✅ **Sepolia ETH** - for contract deployment (~0.1 ETH for gas)
  - Get from [Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- ✅ **Infura API Key** - free at [infura.io](https://infura.io)
- ✅ **Etherscan API Key** - free at [etherscan.io](https://etherscan.io/apis)

### Check Readiness
```bash
# Verify Node.js and npm
node --version  # Should be v16.x or higher
npm --version   # Should be v8.x or higher

# Verify Git
git --version

# Go to CrowdTank project
cd d:\PROJECTS\CROWDTANK\CROWDTANK
npm list | head -20  # Should show installed packages
```

---

## Phase 1: Smart Contract Deployment

### ⚠️ CRITICAL: Deploy Contract FIRST

Your frontend needs a deployed contract address. Follow these steps:

### Step 1: Configure Environment Variables

```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK
```

Create `.env` file in project root:

```env
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**How to get keys:**

**Infura Key**:
1. Go to [infura.io](https://infura.io)
2. Sign up → Create new project
3. Select "Ethereum" → "Sepolia"
4. Copy the RPC URL

**Etherscan API Key**:
1. Go to [etherscan.io/apis](https://etherscan.io/apis)
2. Sign up → Create API key
3. Copy the key

**Private Key** ⚠️ **NEVER SHARE**:
1. MetaMask → Settings → Security & Privacy
2. Click "Export Private Key"
3. Copy (only for testing - never use mainnet keys here!)

### Step 2: Get Sepolia Test ETH

```bash
# Check your wallet address in MetaMask
# Then go to: https://www.alchemy.com/faucets/ethereum-sepolia
# Paste address → Claim ETH (you'll get 0.5 ETH free)

# Verify balance:
# MetaMask → Switch to Sepolia network → Check balance
```

**Wait 5-30 seconds for confirmation**

### Step 3: Deploy Smart Contract to Sepolia

```bash
# Deploy
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output**:
```
========================================
Deploying CrowdTank Contract...
========================================

✅ CrowdTank deployed successfully!

Contract Address: 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Network: Sepolia
Transaction Hash: 0x1234...

========================================
Deployment Summary:
========================================
Contract deployed on Sepolia
Address: 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12
```

### Step 4: Verify Contract on Etherscan (Optional but Recommended)

```bash
# Verify contract code on Etherscan
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS

# Example:
# npx hardhat verify --network sepolia 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12
```

**Result**: Your contract will be verified on Etherscan ✅

---

## Phase 2: Frontend Preparation

### Step 1: Update Contract Address in Config

```bash
cd d:\PROJECTS\CROWDTANK\CROWDTANK
```

Open `frontend/src/config.js`:

```javascript
export const CONTRACT_ADDRESS = "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12";  // UPDATE: Your deployed address
export const CHAIN_ID = 11155111;  // Sepolia
export const CHAIN_NAME = "Sepolia";
export const NETWORK_RPC = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
```

### Step 2: Test Locally (Optional)

```bash
cd frontend
npm install     # Make sure all dependencies are installed
npm start       # Start dev server on localhost:3000
```

**Test in browser**:
1. Open http://localhost:3000
2. Connect wallet → Should connect without errors
3. Create a test project
4. Fund a project
5. Try withdrawals

**Stop with Ctrl+C when done**

### Step 3: Build for Production

```bash
cd frontend
npm run build
```

**Expected Output**:
```
npm notice 
npm notice new minor version of npm available: 9.x.x -> 10.x.x
npm notice to update run `npm install -g npm@10.x.x`
npm notice 

> crowdtank@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

Build folder is ready to be deployed.
```

**Production build created at**: `frontend/build/`

### Step 4: Create Netlify Configuration File

In project root (`d:\PROJECTS\CROWDTANK\CROWDTANK/`), create `netlify.toml`:

```toml
# Netlify Build Configuration

[build]
# Build command
command = "cd frontend && npm install && npm run build"

# Directory to publish
publish = "frontend/build"

# Build environment
environment = { NODE_ENV = "production" }

[build.environment]
# Node.js version
NODE_VERSION = "16.13.0"
# npm version
NPM_VERSION = "8.1.0"

# Redirect all routes to index.html (for React Router)
[[redirects]]
from = "/*"
to = "/index.html"
status = 200

# Cache control headers
[[headers]]
for = "/*"
[headers.values]
Cache-Control = "public, max-age=3600"

[[headers]]
for = "/static/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

### Step 5: Push to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: ready for Netlify deployment"

# Create repository on GitHub (https://github.com/new)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/crowdtank.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Phase 3: Netlify Account Setup

### Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign up"** (top right)
3. **Recommended**: Sign up with **GitHub**
4. Authorize Netlify to access your GitHub account
5. Verify email if needed

### Step 2: Grant Netlify GitHub Access

1. Once logged in, go to **Team overview** → **Sites**
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"GitHub"**
4. **Select your repository**: `crowdtank`
5. Click **"Configure the Netlify App on GitHub"** (if needed)

---

## Phase 4: Deploy to Netlify

### Step 1: Connect GitHub Repository

From Netlify dashboard:

1. Click **"Add new site"** → **"Import an existing project"**
2. Select **"GitHub"**
3. Search for `crowdtank` repository
4. Click to select it
5. You'll see the import dialog

### Step 2: Configure Build Settings

In the "Deploy settings" page:

```
Branch to deploy: main
Build command: cd frontend && npm install && npm run build
Publish directory: frontend/build
```

**These should populate automatically from netlify.toml**

### Step 3: Add Environment Variables (IMPORTANT ⚠️)

**Before clicking Deploy**, add environment variables:

1. Click **"Show advanced"** (if visible)
2. Or click **"Save & deploy"** first, then go to **Site settings** → **Build & deploy** → **Environment**
3. Add variables:

```
CONTRACT_ADDRESS = 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12
CHAIN_ID = 11155111
REACT_APP_CONTRACT_ADDRESS = 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12
REACT_APP_CHAIN_ID = 11155111
```

**Why these variables?**
- React build needs `REACT_APP_` prefix to access env vars
- Contract address must be accessible in production

### Step 4: Deploy

1. Click **"Deploy"** button
2. Netlify starts building your project
3. Watch the build log:

```
1. Cloning repository...
2. Installing dependencies... (takes 30-60 seconds)
3. Building React app... (takes 1-2 minutes)
4. Optimizing assets...
5. Deploying to CDN...
✅ Deploy succeeded!
```

**Expected time**: 3-5 minutes total

### Step 5: Get Your Live URL

Once deployed, Netlify shows:

```
🎉 Deploy successful!

Site URL: https://crowdtank-xyz.netlify.app
```

**Your app is now LIVE!** 🚀

---

## Phase 5: Verification & Testing

### Step 1: Access Your Live Site

1. Click the site URL or visit it directly
2. **Expected**: CrowdTank UI loads
3. **Check browser console** (F12 → Console) for any errors

### Step 2: Verify Wallet Connection

```
1. Click "Connect Wallet"
2. MetaMask should open
3. Select Sepolia network
4. Click "Connect"
5. Account address and balance should display
```

### Step 3: Test Core Functions

**Create Project Test**:
```
1. Fill in form:
   - Name: "Test Project"
   - Description: "Testing deployment"
   - Goal: 0.1 ETH
   - Duration: 3 days
   - ID: 1

2. Click "Create Project"
3. MetaMask popup → Confirm
4. Wait 15-30 seconds for transaction
5. Project should appear in list
```

**Fund Project Test**:
```
1. Click "Fund Project" on any project
2. Modal opens → Enter 0.05 ETH
3. Click "Fund"
4. MetaMask popup → Confirm
5. Project progress bar updates
```

**Check Transaction**:
```
1. Look for confirmation message
2. Verify on Etherscan:
   - Go to https://sepolia.etherscan.io
   - Paste transaction hash
   - Confirm transaction was successful
```

### Step 4: Mobile Test

Test on mobile device:

```
1. Scan QR code or visit URL on phone
2. Connect MetaMask mobile wallet
3. Test creating/funding projects
4. Verify responsive design
```

### Step 5: Performance Check

Netlify dashboard shows:

```
Build time: 3-5 minutes
Deploy status: ✅ Published
Site size: ~2-3 MB
Performance: Good/Excellent
```

---

## Troubleshooting

### ❌ Build Failed - Dependency Issues

**Error**: `npm ERR! 404 Not Found`

**Solution**:
```bash
# Update netlify.toml build command
[build]
command = "npm install && cd frontend && npm install && npm run build"
```

---

### ❌ MetaMask Won't Connect

**Error**: "Please install MetaMask" or connection fails

**Solution**:
1. Install [MetaMask browser extension](https://metamask.io)
2. Create account
3. Switch to **Sepolia network**
4. Refresh the page → Try connecting again

---

### ❌ Contract Address Error

**Error**: "Contract address not found" or "No code at address"

**Solution**:
```bash
# Verify contract is deployed:
# 1. Go to https://sepolia.etherscan.io
# 2. Paste your contract address
# 3. Should show "Contract" tab
# 4. Update frontend/src/config.js with correct address
# 5. Redeploy to Netlify
```

**Redeploy**:
1. Go to Netlify site
2. **Deployments** → Find latest deploy
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait 3-5 minutes

---

### ❌ Insufficient Funds Error

**Error**: "Insufficient balance for gas fees"

**Solution**:
```bash
# Get more Sepolia ETH (free):
# 1. Go to https://www.alchemy.com/faucets/ethereum-sepolia
# 2. Paste wallet address
# 3. Click "Send Me ETH"
# 4. Wait 5-30 seconds
# 5. Check MetaMask balance increased
# 6. Try again
```

---

### ❌ Wrong Network Error

**Error**: "You're on the wrong network" or "Expected chain ID"

**Solution**:
```bash
# In MetaMask:
# 1. Click network dropdown (top)
# 2. Select "Sepolia"
# 3. If not listed:
#    - Settings → Networks → Add Network
#    - Name: Sepolia
#    - RPC: https://sepolia.infura.io/v3/YOUR_KEY
#    - Chain ID: 11155111
#    - Currency: ETH
# 4. Save and refresh the page
```

---

### ❌ Slow Load Times

**Issue**: Site takes 10+ seconds to load

**Solution**:
1. **Clear Cache**:
   - Netlify → Site settings → Deploys → "Clear cache and redeploy"
2. **Check Build Performance**:
   - Netlify → Deploys → Click latest
   - Look for slow build steps
3. **Optimize Frontend**:
   - Check for large images
   - Remove unused dependencies
   - Run `npm audit` to find issues

---

### ❌ GitHub Integration Issues

**Error**: "Failed to connect to GitHub"

**Solution**:
```bash
# Re-authorize Netlify:
# 1. Go to https://app.netlify.com/account/applications
# 2. Find "Netlify"
# 3. Click "Configure"
# 4. Grant necessary permissions
# 5. Return to Netlify dashboard
```

---

### ❌ Blank Page / 404 Error

**Error**: Blank page loads or "404 Not Found"

**Solution**:
```bash
# Check netlify.toml has React redirect:

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

# If missing:
# 1. Add to netlify.toml
# 2. Git push
# 3. Netlify auto-redeploys
# 4. Wait 3-5 minutes
```

---

## Post-Deployment

### Step 1: Configure Custom Domain (Optional)

1. Netlify → Site settings → Domain management
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `crowdtank.com`)
4. Netlify provides nameserver info
5. Update your domain registrar (GoDaddy, Namecheap, etc.)
6. Wait 24-48 hours for DNS propagation

### Step 2: Enable HTTPS (Automatic)

✅ Netlify automatically enables HTTPS with free SSL certificate

- Check site URL starts with `https://`
- Certificate auto-renews

### Step 3: Monitor Deployment

**Set up notifications for deploys**:
1. Netlify → Site settings → Notifications
2. Click **"Add notification"** → **"Slack"** or **"Email"**
3. Get alerts when deploys succeed/fail

### Step 4: GitHub Auto-Deploy Setup

Current setup: **Auto-deploy on every GitHub push** ✅

To disable:
1. Netlify → Site settings → Build & deploy → "Edit settings"
2. Click **"Disconnect repository"**

To change auto-deploy branch:
1. Site settings → Build & deploy → Deployed branch
2. Select different branch (e.g., `staging`)

### Step 5: Uptime Monitoring (Optional)

Monitor if your site goes down:
- Use [UptimeRobot.com](https://uptimerobot.com) (free)
- Monitor URL: `https://crowdtank-xyz.netlify.app`
- Get alerts via email/Slack

### Step 6: Analytics & Performance

**View Netlify analytics**:
1. Netlify → Analytics
2. See:
   - Unique visitors
   - Bandwidth used
   - Request count

**Monitor MetaMask connections**:
- Add Google Analytics to track user interactions
- (Advanced - optional setup)

---

## Checklist: Post-Deployment

- [ ] Site loads without errors
- [ ] MetaMask connects successfully
- [ ] Can create a project
- [ ] Can fund a project
- [ ] Transactions appear on Etherscan
- [ ] Contract address is correct
- [ ] Using Sepolia network
- [ ] Mobile responsive ✅
- [ ] HTTPS enabled ✅
- [ ] Build time < 5 minutes
- [ ] No console errors
- [ ] Wallet balance displays correctly

---

## Quick Reference: Important URLs

| Service | URL |
|---------|-----|
| **Live Site** | `https://crowdtank-xyz.netlify.app` |
| **Netlify Dashboard** | https://app.netlify.com |
| **GitHub Repo** | https://github.com/YOUR_USERNAME/crowdtank |
| **Sepolia Etherscan** | https://sepolia.etherscan.io |
| **Sepolia Faucet** | https://www.alchemy.com/faucets/ethereum-sepolia |
| **Infura Console** | https://infura.io/dashboard |
| **Etherscan API** | https://etherscan.io/apis |

---

## Updating Your Deployment

### When You Make Changes:

**Automatic (Recommended)**:
```bash
# Make changes locally
# Test locally
git add .
git commit -m "feat: description of changes"
git push origin main
# Netlify automatically redeploys in 3-5 minutes
```

**Manual** (if auto-deploy disabled):
1. Netlify → Deploys
2. Click **"Trigger deploy"** → **"Deploy site"**

### Rollback to Previous Deploy:

1. Netlify → Deploys
2. Find previous successful deploy
3. Click **"Restore"**
4. Automatic rollback in 1-2 minutes

---

## Security Best Practices

### ⚠️ DO NOT:
- ❌ Commit `.env` file to GitHub
- ❌ Share private keys in commits
- ❌ Use mainnet private key on this setup
- ❌ Expose API keys in frontend code

### ✅ DO:
- ✅ Use Sepolia testnet for testing
- ✅ Store environment variables in Netlify only
- ✅ Use `.gitignore` for sensitive files
- ✅ Rotate API keys regularly
- ✅ Only deploy tested code

---

## Next Steps

### For Production Deployment (Mainnet):

1. **Audit Smart Contract** - Professional security audit
2. **Test Extensively** - User acceptance testing (UAT)
3. **Use Mainnet Contract** - Deploy to Ethereum mainnet
4. **Mainnet Private Key** - Never use on personal machine
5. **Monitor Closely** - Set up alerting and monitoring

### For Feature Additions:

1. Create feature branch: `git checkout -b feature/new-feature`
2. Test locally: `npm start`
3. Push and create Pull Request
4. Merge to main after approval
5. Netlify auto-deploys

---

## Support & Resources

| Resource | Link |
|----------|------|
| Netlify Docs | https://docs.netlify.com |
| React Deployment | https://docs.netlify.com/frameworks/react |
| Environment Variables | https://docs.netlify.com/environment-variables |
| Troubleshooting | https://docs.netlify.com/troubleshooting |
| Sepolia Docs | https://sepolia.dev |
| MetaMask Docs | https://docs.metamask.io |

---

## Getting Help

If deployment fails:

1. **Check Netlify Build Log**:
   - Netlify → Deployments → Click latest
   - Expand "Deploy log" for error details

2. **Check Browser Console**:
   - Press F12 → Console tab
   - Look for red error messages

3. **Check Etherscan**:
   - https://sepolia.etherscan.io
   - Verify contract address exists
   - Check transaction history

4. **Common Issues**:
   - See [Troubleshooting](#troubleshooting) section above

---

## Summary

You've successfully:
1. ✅ Deployed smart contract to Sepolia
2. ✅ Prepared frontend for production
3. ✅ Connected GitHub to Netlify
4. ✅ Deployed to Netlify with auto-updates
5. ✅ Configured environment variables
6. ✅ Verified everything works
7. ✅ Set up for future changes

**Your dApp is now LIVE on the internet!** 🎉

For questions or issues: See troubleshooting section or check GitHub issues.

---

## Document Information

- **Created**: April 2026
- **Last Updated**: April 2026
- **Version**: 1.0
- **Status**: ✅ Production Ready
