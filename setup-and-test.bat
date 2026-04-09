@echo off
REM CrowdTank Project Setup and Test Script
REM =========================================

echo.
echo ========================================
echo  CrowdTank Deployment & Test Guide
echo ========================================
echo.

echo This script will help you set up and test the CrowdTank project.
echo.

echo Step 1: Make sure Hardhat node is running
echo =========================================
echo Open a new terminal/PowerShell and run:
echo   npx hardhat node
echo.
echo Press Enter once the node is running and shows "Started HTTP and WebSocket..."
pause

echo.
echo Step 2: Deploying and testing contract
echo =========================================
echo.
call npx hardhat run scripts/test-deploy.js --network localhost

echo.
echo Step 3: Copy the contract address from above
echo =========================================
echo.
echo Save the contract address shown above (0x...), you'll need it next.
echo.
pause

echo.
echo Step 4: Running interaction demo
echo =========================================
echo.
echo Set the contract address environment variable and run interact.js
setlocal enabledelayedexpansion

set /p CONTRACT_ADDR="Enter the contract address (0x...): "

echo.
echo Running interaction script with address: !CONTRACT_ADDR!
echo.

set CONTRACT_ADDRESS=!CONTRACT_ADDR!
call npx hardhat run scripts/interact.js --network localhost

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Frontend Setup:
echo   cd frontend
echo   npm install
echo   Update CONTRACT_ADDRESS in src/config.js to: !CONTRACT_ADDR!
echo   npm start
echo.
pause
