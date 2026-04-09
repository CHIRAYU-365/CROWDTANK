# Vercel Deployment Guide

## Overview
The CrowdTank project is now configured for Vercel deployment. Vercel is optimized for hosting the React frontend, while smart contract deployment is handled separately.

## Setup Steps

### 1. Connect to Vercel
```bash
npm i -g vercel
vercel login
vercel link
```

### 2. Set Environment Variables in Vercel Dashboard
Navigate to your project settings and add these environment variables:

- `CONTRACT_ADDRESS` - The deployed Sepolia contract address (e.g., 0xE52F6B9a1821A3Fac8CA08f4DC356bC8327457c3)
- `SEPOLIA_RPC` - RPC URL (https://sepolia.infura.io/v3/YOUR_KEY)
- `ETHERSCAN_API_KEY` - For contract verification (optional)

### 3. Deploy from Git
```bash
git push origin main
```

Vercel will automatically:
1. Install frontend dependencies
2. Build the React app to `frontend/build/`
3. Serve the production build globally via CDN

## Build Configuration

- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **Framework**: React (auto-detected)

## Smart Contract Deployment (Separate Process)

Contract deployment to Sepolia is NOT run during Vercel builds (to avoid timeouts).

### Deploy Contract Locally:
```bash
npm run deploy:sepolia
```

This will:
1. ✅ Deploy CrowdTank contract to Sepolia
2. ✅ Update `frontend/src/config.js` automatically
3. ✅ Output the new contract address

### Then Push to Git:
```bash
git add frontend/src/config.js .env
git commit -m "Update contract address after deployment"
git push origin main
```

Vercel will rebuild with the new contract address.

## File Structure

```
CROWDTANK/
├── vercel.json              # Vercel build configuration
├── netlify.toml             # Netlify configuration (optional)
├── .vercelignore            # Files to exclude from Vercel builds
├── frontend/                # React app (deployed to Vercel)
│   ├── src/
│   │   └── config.js        # Contract address & network config
│   └── build/               # Production build output
├── contracts/               # Smart contracts (not deployed with Vercel)
├── scripts/
│   ├── deploy.js           # Contract deployment
│   └── concurrent-deploy.js # Local development deployment
└── package.json
```

## Troubleshooting

### Build takes too long
- Vercel has a 45-minute build timeout
- Current setup only builds frontend (~2-3 minutes)
- If you add more dependencies, build time increases

### frontend/build/ directory not created
- Check the build logs: `vercel logs`
- Ensure `npm run build` succeeds locally
- Clear cache: `vercel env list` then redeploy

### Contract address not loading in app
- Update `frontend/src/config.js` with correct address
- Set `CONTRACT_ADDRESS` environment variable in Vercel dashboard
- Frontend reads from config.js, not from env vars

## Legacy: Netlify Configuration

If you want to keep Netlify as an option (concurrent contract deployment + frontend build):

```bash
# Deploy to Netlify with contract deployment
netlify deploy
```

The `netlify.toml` stays configured for this, but we recommend Vercel for frontend-only hosting.
