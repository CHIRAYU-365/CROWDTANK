# CrowdTank Deployment Quick Reference

## 📋 Three-Step Deployment Summary

### Local Development (Recommended for Testing)
```bash
STEP 1: npx hardhat node                                    # Keep running
STEP 2: npx hardhat run scripts/deploy.js --network localhost
STEP 3: Update CONTRACT_ADDRESS in frontend/src/config.js
STEP 4: cd frontend && npm start                            # Visit localhost:3000
```

### Sepolia Testnet (Pre-Production)
```bash
STEP 1: Create .env file with SEPOLIA_RPC, PRIVATE_KEY
STEP 2: Get Sepolia ETH from https://www.alchemy.com/faucets/ethereum-sepolia
STEP 3: npx hardhat run scripts/deploy.js --network sepolia
STEP 4: Update CONTRACT_ADDRESS in frontend/src/config.js (11155111 chain ID)
STEP 5: cd frontend && npm start
```

### Production Frontend (Vercel/Netlify)
```bash
STEP 1: Build: cd frontend && npm run build
STEP 2: Deploy build/ folder to Vercel/Netlify
STEP 3: Set CONTRACT_ADDRESS environment variable
```

---

## 🔐 Environment Variables

Create `.env` file with:
```
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_key
```

---

## 📍 Contract Configuration

### For Localhost
```javascript
export const CONTRACT_ADDRESS = "0x...";  // From deploy.js output
export const CHAIN_ID = 31337;            // Hardhat
export const CHAIN_NAME = "Hardhat (Localhost)";
```

### For Sepolia
```javascript
export const CONTRACT_ADDRESS = "0x...";  // From deploy.js output
export const CHAIN_ID = 11155111;         // Sepolia
export const CHAIN_NAME = "Sepolia Testnet";
```

### For Mainnet
```javascript
export const CONTRACT_ADDRESS = "0x...";  // From deploy.js output
export const CHAIN_ID = 1;                // Mainnet
export const CHAIN_NAME = "Ethereum Mainnet";
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8545 already in use | Kill: `lsof -ti:8545 \| xargs kill -9` |
| MetaMask not detecting localhost | Add custom network: http://localhost:8545, Chain ID: 31337 |
| "Contract not found" error | Copy correct address from deploy.js output |
| Insufficient Sepolia ETH | Visit Sepolia faucet: https://www.alchemy.com/faucets |
| npm install fails | Clear cache: `npm cache clean --force` then retry |

---

## ✅ Verification Checklist

- [ ] Hardhat node running (localhost) or provider configured
- [ ] Script deployed successfully
- [ ] Contract address copied correctly
- [ ] Frontend CONTRACT_ADDRESS updated
- [ ] Correct CHAIN_ID set for network
- [ ] MetaMask connected to correct network
- [ ] MetaMask has test ETH
- [ ] Frontend starts without console errors
- [ ] "Connect Wallet" button works
- [ ] Can create project
- [ ] Can fund project
- [ ] Can see transactions complete

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `hardhat.config.js` | Network configuration |
| `scripts/deploy.js` | Deploy smart contract |
| `frontend/src/config.js` | Frontend contract config |
| `.env` | Secret keys (never commit!) |
| `contracts/CrowdTank.sol` | Smart contract code |

---

## 🌐 Network References

### Sepolia Testnet
- Chain ID: `11155111`
- Block Explorer: https://sepolia.etherscan.io
- Faucet: https://www.alchemy.com/faucets/ethereum-sepolia
- RPC: https://sepolia.infura.io/v3/

### Ethereum Mainnet
- Chain ID: `1`
- Block Explorer: https://etherscan.io
- RPC: https://mainnet.infura.io/v3/

### Localhost (Hardhat)
- Chain ID: `31337`
- RPC: http://localhost:8545
- Test ETH: 10,000 per account

---

## 📞 Getting Help

1. Check browser console (F12) for errors
2. Check terminal output for deployment logs
3. View [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps
4. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

---

## 🚀 Deploy in 5 Minutes

```bash
# For localhost testing:
npx hardhat node &
npx hardhat run scripts/deploy.js --network localhost
# Copy contract address
# Edit frontend/src/config.js
cd frontend && npm start
# Open localhost:3000 in browser
```

---

**Last Updated:** April 2026
**Supported Networks:** Localhost, Sepolia, Mainnet
**Frontend Options:** Vercel, Netlify, Self-hosted
