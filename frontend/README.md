# CrowdTank Frontend

A React-based frontend for the CrowdTank decentralized crowdfunding platform.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## Features

- 🔗 Connect MetaMask wallet
- 📋 View all projects
- ➕ Create new crowdfunding projects
- 💰 Fund projects
- 💼 View your contributions
- 🏦 Withdraw funds (for successful/failed projects)
- 📊 Real-time project status

## Configuration

Update `src/config.js` with your contract address after deployment:

```javascript
export const CONTRACT_ADDRESS = "0x..."; // Your deployed contract address
```

## Environment

The frontend connects to:
- **Local Development**: `http://127.0.0.1:8545` (Hardhat network)
- **Sepolia Testnet**: Configured via MetaMask

## Browser Requirements

- MetaMask or Ethereum-compatible wallet
- Modern browser (Chrome, Firefox, Safari, Edge)
