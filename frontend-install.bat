@echo off
REM Frontend Installation Script for CrowdTank
REM This script installs all frontend dependencies

echo.
echo ========================================
echo CrowdTank Frontend Setup
echo ========================================
echo.

cd frontend

echo Installing frontend dependencies...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Installation Complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update CONTRACT_ADDRESS in src/config.js
    echo 2. Run: npm start
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ Installation Failed
    echo ========================================
    echo.
    echo Make sure Node.js is installed:
    echo https://nodejs.org/
    echo.
)

pause
