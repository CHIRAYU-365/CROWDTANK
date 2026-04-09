#!/bin/bash

# CrowdTank Setup & Deployment Script for Mac/Linux
# This script automates the initial setup and local deployment

echo ""
echo "========================================"
echo "CrowdTank Setup & Deployment Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[1/4] Checking prerequisites..."
echo "- Node.js: $(node --version)"
echo "- npm: $(npm --version)"
echo ""

echo "[2/4] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install root dependencies"
    exit 1
fi

cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "[3/4] Compiling smart contracts..."
npx hardhat compile
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to compile contracts"
    exit 1
fi

echo ""
echo "[4/4] Setup complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo ""
echo "1. Start Hardhat Node (in a new terminal):"
echo "   npx hardhat node"
echo ""
echo "2. Deploy Contract (in another new terminal):"
echo "   npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "3. Copy the contract address from step 2"
echo ""
echo "4. Update CONTRACT_ADDRESS in:"
echo "   frontend/src/config.js"
echo ""
echo "5. Start Frontend (in another new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "6. Open http://localhost:3000 in your browser"
echo ""
echo "7. Connect MetaMask:"
echo "   - Network: Hardhat Localhost"
echo "   - RPC: http://localhost:8545"
echo "   - Chain ID: 31337"
echo ""
echo "========================================"
echo ""
