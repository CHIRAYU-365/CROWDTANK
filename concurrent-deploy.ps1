#!/usr/bin/env pwsh
<#
    .SYNOPSIS
    CrowdTank Concurrent Deployment Script (PowerShell)
    
    .DESCRIPTION
    This script launches all terminals and deploys automatically.
    It will:
      1. Start Hardhat node in Terminal 1
      2. Deploy contract to specified network
      3. Auto-update contract address in config.js
      4. Start React frontend in Terminal 2
    
    .PARAMETER Network
    The network to deploy to (default: localhost)
    
    .EXAMPLE
    .\concurrent-deploy.ps1
    .\concurrent-deploy.ps1 -Network localhost
    .\concurrent-deploy.ps1 -Network sepolia
    
    .NOTES
    - Requires Node.js and npm to be installed
    - For Sepolia: ensure .env file has SEPOLIA_RPC and PRIVATE_KEY
    - Both terminals must remain open while developing
#>

param(
    [Parameter(Position = 0)]
    [string]$Network = "localhost"
)

# Set error action to stop on errors
$ErrorActionPreference = "Stop"

# Colors for output
$colors = @{
    Reset  = "`e[0m"
    Green  = "`e[32m"
    Red    = "`e[31m"
    Yellow = "`e[33m"
    Blue   = "`e[34m"
    Cyan   = "`e[36m"
}

function Write-Header {
    param([string]$Text)
    Write-Host "`n$($colors.Cyan)$Text$($colors.Reset)" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "$($colors.Green)✅ $Text$($colors.Reset)" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "$($colors.Red)❌ $Text$($colors.Reset)" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Text)
    Write-Host "$($colors.Yellow)⚠️  $Text$($colors.Reset)" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Text)
    Write-Host "$($colors.Blue)ℹ️  $Text$($colors.Reset)" -ForegroundColor Blue
}

# Display banner
Clear-Host
Write-Header "=========================================================="
Write-Header "  CrowdTank Concurrent Deployment - $Network"
Write-Header "=========================================================="
Write-Host "This script will:"
Write-Host "  1. Launch Hardhat node in a new PowerShell window"
Write-Host "  2. Deploy contract to $Network"
Write-Host "  3. Auto-update config.js with contract address"
Write-Host "  4. Start React frontend in a new PowerShell window"
Write-Header "=========================================================="

try {
    # Check requirements
    Write-Host "[Step 1/5] Checking requirements..."
    
    $node = Get-Command node -ErrorAction Stop
    Write-Success "Node.js found: $($node.Source)"
    
    $npm = Get-Command npm -ErrorAction Stop
    Write-Success "npm found: $($npm.Source)"
    Write-Host ""
    
    # Run concurrent deployment
    Write-Host "[Step 2/5] Running concurrent deployment orchestrator..."
    Write-Host ""
    
    & node scripts\concurrent-deploy.js $Network
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Error-Custom "Deployment failed with exit code $LASTEXITCODE"
        Write-Host ""
        Write-Host "Troubleshooting:"
        Write-Host "  1. Make sure Hardhat is installed: npm install"
        Write-Host "  2. Check that port 8545 is not in use"
        Write-Host "  3. For Sepolia: ensure .env has SEPOLIA_RPC and PRIVATE_KEY"
        Write-Host "  4. Check frontend dependencies: cd frontend && npm install"
        Write-Host ""
        exit 1
    }
    
    Write-Host ""
    Write-Header "=========================================================="
    Write-Header "✅ Deployment Complete!"
    Write-Header "=========================================================="
    Write-Host ""
    Write-Info "Your app is now running:"
    Write-Host "  - Hardhat Node: Available in new PowerShell window 1"
    Write-Host "  - Webpack Dev Server starting in new PowerShell window 2"
    Write-Host "  - Browser will open at: http://localhost:3000"
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "  1. Wait for React to compile (may take 1-2 minutes)"
    Write-Host "  2. Browser will auto-open to http://localhost:3000"
    Write-Host "  3. Connect MetaMask and test the app"
    Write-Host "  4. Check Hardhat terminal for blockchain events"
    Write-Host ""
    Write-Warning-Custom "IMPORTANT:"
    Write-Host "  - Contract address has been auto-updated in config.js"
    Write-Host "  - Both terminals must stay running while you develop"
    Write-Host "  - Close terminals when done or press Ctrl+C"
    Write-Host ""
    Write-Header "=========================================================="
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Error-Custom "Error: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Troubleshooting:"
    Write-Host "  1. Ensure Node.js and npm are installed"
    Write-Host "  2. Run from project root directory"
    Write-Host "  3. Check file permissions"
    Write-Host ""
    exit 1
}
