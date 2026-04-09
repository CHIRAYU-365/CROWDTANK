@echo off
REM =========================================================
REM CrowdTank Interactive Deployment Menu
REM =========================================================
REM Choose what you want to do with an interactive menu

:menu
cls
echo.
echo =========================================================
echo   CrowdTank Smart Contract & Frontend Deployment menu
echo =========================================================
echo.
echo Select an option:
echo.
echo   [1] Deploy Locally (Localhost + Hardhat Node)
echo       - Best for development
echo       - All terminals auto-launch
echo       - Contract address auto-updated
echo.
echo   [2] Deploy to Sepolia Testnet
echo       - Requires .env with SEPOLIA_RPC and PRIVATE_KEY
echo       - Gets real ETH test funds
echo       - Auto-updates frontend config
echo.
echo   [3] Manual Localhost Deployment
echo       - Launch Hardhat node manually
echo       - Deploy contract manually
echo       - Update config manually
echo.
echo   [4] Manual Sepolia Deployment
echo       - Deploy to Sepolia separately
echo       - Manual steps for control
echo.
echo   [5] Compile Smart Contracts Only
echo       - Compile without deployment
echo       - Check for compilation errors
echo.
echo   [6] Run Tests
echo       - Run full test suite
echo       - Check contract functionality
echo.
echo   [7] Start Hardhat Node Only
echo       - Just run the Hardhat node
echo       - Use for manual deployment
echo.
echo   [8] Start Frontend Only
echo       - React dev server on localhost:3000
echo       - Requires contract already deployed
echo.
echo   [9] View Documentation
echo       - Opens deployment guide
echo.
echo   [0] Exit
echo.
echo =========================================================

setlocal enabledelayedexpansion

set /p choice="Enter option number [0-9]: "

if "%choice%"=="1" (
    call :deploy_localhost
) else if "%choice%"=="2" (
    call :deploy_sepolia
) else if "%choice%"=="3" (
    call :manual_localhost
) else if "%choice%"=="4" (
    call :manual_sepolia
) else if "%choice%"=="5" (
    call :compile
) else if "%choice%"=="6" (
    call :test
) else if "%choice%"=="7" (
    call :hardhat_node
) else if "%choice%"=="8" (
    call :frontend_only
) else if "%choice%"=="9" (
    call :docs
) else if "%choice%"=="0" (
    exit /b 0
) else (
    echo.
    echo Invalid option. Please try again.
    timeout /t 2 >nul
    goto menu
)

echo.
echo Press any key to return to menu...
pause >nul
goto menu

REM =========================================================
REM DEPLOYMENT FUNCTIONS
REM =========================================================

:deploy_localhost
echo.
echo =========================================================
echo Starting Concurrent Localhost Deployment...
echo =========================================================
echo.
call concurrent-deploy.bat localhost
exit /b

:deploy_sepolia
echo.
echo =========================================================
echo Starting Concurrent Sepolia Deployment...
echo =========================================================
echo.
echo Prerequisites:
echo   - .env file with SEPOLIA_RPC and PRIVATE_KEY
echo   - Sepolia ETH in your wallet
echo.
call concurrent-deploy.bat sepolia
exit /b

:manual_localhost
echo.
echo =========================================================
echo Manual Localhost Deployment (3 Terminals)
echo =========================================================
echo.
echo This will open 3 terminals for manual control:
echo   1. Hardhat node
echo   2. Contract deployment
echo   3. Frontend
echo.
pause

echo Launching Terminal 1: Hardhat Node...
start cmd /k "title Hardhat Node [Terminal 1] && cd %CD% && npx hardhat node"

echo Waiting for node to start (10 seconds)...
timeout /t 10 >nul

echo Launching Terminal 2: Deploy...
start cmd /k "title Deploy [Terminal 2] && cd %CD% && npx hardhat run scripts/deploy.js --network localhost && pause"

echo.
echo Terminal 2 will show the contract address.
echo Copy it and update frontend/src/config.js CONTRACT_ADDRESS
echo.
pause

echo Launching Terminal 3: Frontend...
start cmd /k "title React Frontend [Terminal 3] && cd %CD%\frontend && npm start"

echo.
echo Manual deployment started. Check all 3 terminals.
echo.
exit /b

:manual_sepolia
echo.
echo =========================================================
echo Manual Sepolia Deployment
echo =========================================================
echo.
echo Prerequisites:
echo   - .env file configured with SEPOLIA_RPC and PRIVATE_KEY
echo   - Sepolia ETH available (~0.1 ETH for gas)
echo.
pause

echo Checking .env file...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create it with SEPOLIA_RPC and PRIVATE_KEY
    pause
    exit /b 1
)

echo Deploying to Sepolia...
call npx hardhat run scripts/deploy.js --network sepolia

if errorlevel 1 (
    echo.
    echo Deployment failed. Check error messages above.
    pause
    exit /b 1
)

echo.
echo Deployment complete!
echo Copy the contract address and update frontend/src/config.js
echo.
echo After updating, start frontend with:
echo   cd frontend && npm start
echo.
pause
exit /b

:compile
echo.
echo =========================================================
echo Compiling Smart Contracts...
echo =========================================================
echo.
call npx hardhat compile
echo.
echo Compilation complete.
echo.
exit /b

:test
echo.
echo =========================================================
echo Running Test Suite...
echo =========================================================
echo.
call npm test
echo.
echo Tests complete.
echo.
exit /b

:hardhat_node
echo.
echo =========================================================
echo Starting Hardhat Node...
echo =========================================================
echo.
echo This terminal will stay open for development.
echo Accounts and balances will be shown above.
echo Press Ctrl+C to stop.
echo.
call npx hardhat node
exit /b

:frontend_only
echo.
echo =========================================================
echo Starting React Frontend Only...
echo =========================================================
echo.
echo Prerequisites:
echo   - frontend/src/config.js must have CONTRACT_ADDRESS
echo   - Hardhat node or network must be running
echo.
cd frontend
call npm start
exit /b

:docs
echo.
echo Opening deployment documentation...
echo.
if exist "CONCURRENT_DEPLOYMENT.md" (
    start CONCURRENT_DEPLOYMENT.md
) else if exist "DEPLOYMENT.md" (
    start DEPLOYMENT.md
) else (
    echo Documentation files not found.
)
pause
exit /b
