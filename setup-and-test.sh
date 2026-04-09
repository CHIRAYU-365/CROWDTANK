#!/bin/bash
# CrowdTank Project Setup and Test Script (Mac/Linux)
# ===================================================

echo ""
echo "========================================"
echo "  CrowdTank Deployment & Test Guide"
echo "========================================"
echo ""

echo "Step 1: Make sure Hardhat node is running"
echo "========================================="
echo "Open a new terminal and run:"
echo "  npx hardhat node"
echo ""
echo "Press Enter once the node is running and shows 'Started HTTP and WebSocket...'"
read -p "Ready? "

echo ""
echo "Step 2: Deploying and testing contract"
echo "========================================="
echo ""

# Run test deploy script
npx hardhat run scripts/test-deploy.js --network localhost

echo ""
echo "Step 3: Copy the contract address from above"
echo "========================================="
echo ""

read -p "Enter the contract address (0x...): " CONTRACT_ADDR

echo ""
echo "Step 4: Running interaction demo"
echo "========================================="
echo ""
echo "Running interaction script with address: $CONTRACT_ADDR"
echo ""

export CONTRACT_ADDRESS=$CONTRACT_ADDR
npx hardhat run scripts/interact.js --network localhost

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Frontend Setup:"
echo "   cd frontend"
echo "   npm install"
echo "   Update CONTRACT_ADDRESS in src/config.js to: $CONTRACT_ADDR"
echo "   npm start"
echo ""
