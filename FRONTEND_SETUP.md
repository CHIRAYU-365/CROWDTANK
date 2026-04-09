# CrowdTank Frontend Setup Guide

## Prerequisites

- Node.js v14+ and npm
- MetaMask or Ethereum-compatible wallet
- The CrowdTank smart contract deployed

## Installation

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Update Contract Address

Open `src/config.js` and update `CONTRACT_ADDRESS` with your deployed contract address:

```javascript
export const CONTRACT_ADDRESS = "0x..."; // Your contract address here
```

### 4. Configure Network (Optional)

For Sepolia testnet, update the chain ID in `src/config.js`:

```javascript
export const CHAIN_ID = 11155111; // Sepolia testnet
export const CHAIN_NAME = "Sepolia";
```

## Running the Frontend

### Development Mode
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build
```bash
npm build
```

## Features

### 🔗 Wallet Connection
- Click "Connect Wallet" to connect MetaMask
- View your connected account and ETH balance

### ➕ Create Projects
- Enter project details (name, description, funding goal, duration)
- Assign a unique project ID
- Click "Create Project"

### 💰 Fund Projects
- Browse all projects on the platform
- Click "Fund Project" on any active project
- Enter the amount to contribute
- Confirm the transaction

### 📊 Project Details
- View funding progress with visual progress bar
- See days remaining until deadline
- Check if project is funded or still active
- View your contribution amount

### 🏦 Withdrawals
- **User Withdrawal**: If project deadline passes without reaching goal, withdraw your contribution
- **Admin Withdrawal**: If you're the project creator and goal is reached, claim the funds

## Troubleshooting

### "MetaMask not installed"
- Install MetaMask browser extension
- Visit https://metamask.io/

### "Project does not exist"
- The project ID doesn't exist on the contract
- Make sure you're using the correct project ID

### "Insufficient funds"
- You don't have enough ETH for gas fees
- Get test ETH from faucet for testnet

### Contract address not found
- Update `CONTRACT_ADDRESS` in `src/config.js`
- Make sure you've deployed the contract first

## Network Configuration

### Hardhat Localhost (Default)
- RPC: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Use test accounts from `npx hardhat node`

### Sepolia Testnet
- RPC: `https://sepolia.infura.io/v3/YOUR_KEY`
- Chain ID: `11155111`
- Faucet: https://www.alchemy.com/faucets/ethereum-sepolia

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WalletConnect.jsx      # Wallet connection component
│   │   ├── CreateProject.jsx      # Project creation form
│   │   ├── ProjectCard.jsx        # Individual project display
│   │   └── FundModal.jsx          # Funding modal
│   ├── utils/
│   │   └── contractInteraction.js # Contract interaction functions
│   ├── config.js                  # Contract address and ABI
│   ├── App.jsx                    # Main app component
│   ├── index.jsx                  # React entry point
│   └── index.css                  # Tailwind styles
├── public/
│   └── index.html                 # HTML entry point
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind config
└── postcss.config.js              # PostCSS config
```

## Development Tips

### Hot Reload
Changes to files are automatically reflected in the browser during development.

### Console Debugging
Open browser DevTools (F12) to see console logs and errors.

### Contract Testing
Use Hardhat console to test contract interactions:
```bash
npx hardhat console --network localhost
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory that can be deployed to:
- GitHub Pages
- Vercel
- Netlify
- AWS S3
- Any static hosting service

## Support

For issues:
1. Check the browser console (F12) for error messages
2. Ensure MetaMask is connected to the correct network
3. Verify the contract address is correct
4. Check that the Hardhat node is running (for localhost)
