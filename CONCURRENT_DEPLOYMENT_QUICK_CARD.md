# 🚀 Concurrent Deployment Quick Card

**Everything automated in 1 command!**

---

## One-Command Start

### Windows
```bash
concurrent-deploy.bat          # localhost
concurrent-deploy.bat sepolia  # Sepolia testnet
```

### macOS / Linux
```bash
./concurrent-deploy.sh          # localhost
./concurrent-deploy.sh sepolia  # Sepolia testnet
```

### All Platforms
```bash
node scripts/concurrent-deploy.js localhost
```

---

## What It Does (Automatically)

1. ✅ Launches Hardhat node in **Terminal 1**
2. ✅ Waits for node to be ready
3. ✅ Deploys contract to `localhost` or `sepolia`
4. ✅ **Captures contract address** from output
5. ✅ **Updates frontend/src/config.js** with address
6. ✅ Launches React frontend in **Terminal 2**
7. ✅ Opens browser at `http://localhost:3000`

---

## Network Configuration

| Command | Address Auto | Chain ID | RPC |
|---------|--------|----------|-----|
| `concurrent-deploy.bat` | ✅ | 31337 | localhost:8545 |
| `concurrent-deploy.bat sepolia` | ✅ | 11155111 | Sepolia RPC |

---

## Prerequisites

### Localhost (Default)
- ✅ Node.js v16+
- ✅ npm v8+
- ✅ `npm install` completed
- ⚠️ Port 8545 free

### Sepolia
- ✅ All above +
- ✅ `.env` file with:
  ```
  SEPOLIA_RPC=your_infura_key
  PRIVATE_KEY=your_wallet_key
  ```
- ✅ Sepolia ETH from [faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

---

## What You See

```
Launch Hardhat node ✓
Waiting for node to be ready ✓
Deploying contract to localhost ✓
Contract deployed at: 0x5FbDB...
Updating config.js ✓
Launching React frontend ✓

All services running!
Visit: http://localhost:3000
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 8545 in use | Kill existing hardhat: `taskkill /F /IM node.exe` |
| Node.js not found | Install from https://nodejs.org |
| Contract address blank | Check deploy.js output in Terminal 2 |
| MetaMask won't connect | Switch to Hardat Localhost (Chain ID: 31337) |

---

## Next Steps

1. Open `http://localhost:3000`
2. Connect MetaMask
3. Create project → Fund project → Test withdrawal
4. Both terminals stay open while developing
5. `Ctrl+C` to stop when done

---

## Full Documentation

See: **CONCURRENT_DEPLOYMENT.md** for complete details, advanced usage, and troubleshooting.

---

**Made with ❤️ for CrowdTank**
