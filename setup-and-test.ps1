# CrowdTank Project Setup and Test Script (PowerShell)
# =====================================================

Write-Host ""
Write-Host "========================================"
Write-Host "  CrowdTank Deployment & Test Guide"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Make sure Hardhat node is running" -ForegroundColor Yellow
Write-Host "========================================="
Write-Host "Open a new PowerShell and run:"
Write-Host "  npx hardhat node" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter once the node is running and shows 'Started HTTP and WebSocket...'"
Read-Host "Ready?"

Write-Host ""
Write-Host "Step 2: Deploying and testing contract" -ForegroundColor Yellow
Write-Host "========================================="
Write-Host ""

# Run test deploy script
& npx hardhat run scripts/test-deploy.js --network localhost

Write-Host ""
Write-Host "Step 3: Copy the contract address from above" -ForegroundColor Yellow
Write-Host "========================================="
Write-Host ""

$contractAddr = Read-Host "Enter the contract address (0x...)"

Write-Host ""
Write-Host "Step 4: Running interaction demo" -ForegroundColor Yellow
Write-Host "========================================="
Write-Host ""
Write-Host "Running interaction script with address: $contractAddr" -ForegroundColor Cyan
Write-Host ""

$env:CONTRACT_ADDRESS = $contractAddr
& npx hardhat run scripts/interact.js --network localhost

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend Setup:" -ForegroundColor Yellow
Write-Host "   cd frontend"
Write-Host "   npm install"
Write-Host "   Update CONTRACT_ADDRESS in src/config.js to: $contractAddr"
Write-Host "   npm start"
Write-Host ""
