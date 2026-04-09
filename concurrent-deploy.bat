@echo off
REM =========================================================
REM CrowdTank Concurrent Deployment Script (Windows Batch)
REM =========================================================
REM
REM This script launches all terminals and deploys automatically
REM It will:
REM   1. Start Hardhat node in Terminal 1
REM   2. Deploy contract to specified network
REM   3. Auto-update contract address in config.js
REM   4. Start React frontend in Terminal 2
REM
REM Usage:
REM   concurrent-deploy.bat [network]
REM
REM Examples:
REM   concurrent-deploy.bat localhost (default)
REM   concurrent-deploy.bat sepolia
REM
REM =========================================================

setlocal enabledelayedexpansion

REM Set network (default to localhost)
set NETWORK=%1
if "!NETWORK!"=="" set NETWORK=localhost

REM Display banner
cls
echo.
echo ============================================================
echo   CrowdTank Concurrent Deployment - %NETWORK%
echo ============================================================
echo.
echo This script will:
echo   1. Launch Hardhat node in a new terminal
echo   2. Deploy contract to %NETWORK%
echo   3. Auto-update config.js with contract address
echo   4. Start React frontend in a new terminal
echo.
echo ============================================================
echo.

REM Check requirements
echo [Step 1/5] Checking requirements...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo   ✓ Node.js found
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo   ✓ npm found
echo.

REM Run the concurrent deployment
echo [Step 2/5] Running concurrent deployment orchestrator...
echo.
node scripts\concurrent-deploy.js %NETWORK%

if errorlevel 1 (
    echo.
    echo =========================================================
    echo ERROR: Deployment failed!
    echo =========================================================
    echo.
    echo Troubleshooting:
    echo   1. Make sure Hardhat is installed: npm install
    echo   2. Check that port 8545 is not in use
    echo   3. For Sepolia: ensure .env has SEPOLIA_RPC and PRIVATE_KEY
    echo   4. Check frontend dependencies: cd frontend ^&^& npm install
    echo.
    pause
    exit /b 1
)

echo.
echo =========================================================
echo ✅ Deployment Complete!
echo =========================================================
echo.
echo Your app is now running:
echo   - Hardhat Node: Available in Terminal 1
echo   - Webpack Dev Server starting in Terminal 2
echo   - Browser will open at: http://localhost:3000
echo.
echo Next steps:
echo   1. Wait for React to compile (may take 1-2 minutes)
echo   2. Browser will auto-open to http://localhost:3000
echo   3. Connect MetaMask and test the app
echo   4. Check Hardhat terminal for blockchain events
echo.
echo IMPORTANT:
echo   - Contract address has been auto-updated in config.js
echo   - Both terminals must stay running while you develop
echo   - Close terminals when done or press Ctrl+C
echo.
echo =========================================================
echo.

pause
