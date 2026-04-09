@echo off
REM CrowdTank One-Command Setup Script for Windows
REM This script automates the initial setup and local deployment

echo.
echo ========================================
echo CrowdTank Setup & Deployment Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Checking prerequisites...
echo - Node.js: OK
echo - npm version: %npm_version%
node --version
npm --version
echo.

echo [2/4] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Compiling smart contracts...
call npx hardhat compile
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to compile contracts
    pause
    exit /b 1
)

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Start Hardhat Node (in a new terminal):
echo    npx hardhat node
echo.
echo 2. Deploy Contract (in another new terminal):
echo    npx hardhat run scripts/deploy.js --network localhost
echo.
echo 3. Copy the contract address from step 2
echo.
echo 4. Update CONTRACT_ADDRESS in:
echo    frontend/src/config.js
echo.
echo 5. Start Frontend (in another new terminal):
echo    cd frontend
echo    npm start
echo.
echo 6. Open http://localhost:3000 in your browser
echo.
echo 7. Connect MetaMask:
echo    - Network: Hardhat Localhost
echo    - RPC: http://localhost:8545
echo    - Chain ID: 31337
echo.
echo ========================================
echo.
pause
