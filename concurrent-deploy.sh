#!/bin/bash

###############################################################################
# CrowdTank Concurrent Deployment Script (Unix/Linux/macOS)
#
# This script launches all terminals and deploys automatically
# It will:
#   1. Start Hardhat node in Terminal 1
#   2. Deploy contract to specified network
#   3. Auto-update contract address in config.js
#   4. Start React frontend in Terminal 2
#
# Usage:
#   ./concurrent-deploy.sh [network]
#
# Examples:
#   ./concurrent-deploy.sh                # defaults to localhost
#   ./concurrent-deploy.sh localhost
#   ./concurrent-deploy.sh sepolia
#
# Requirements:
#   - Node.js v16+ and npm v8+
#   - For Sepolia: .env file with SEPOLIA_RPC and PRIVATE_KEY
#
###############################################################################

set -e  # Exit on error

# Parse arguments
NETWORK="${1:-localhost}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
print_header() {
    echo -e "\n${CYAN}${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✅ ${1}${NC}"
}

print_error() {
    echo -e "${RED}❌ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  ${1}${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  ${1}${NC}"
}

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN"
esac

# Display banner
clear
print_header "=========================================================="
print_header "  CrowdTank Concurrent Deployment - $NETWORK"
print_header "=========================================================="
echo "This script will:"
echo "  1. Launch Hardhat node in a new terminal"
echo "  2. Deploy contract to $NETWORK"
echo "  3. Auto-update config.js with contract address"
echo "  4. Start React frontend in a new terminal"
echo ""
print_header "=========================================================="
echo ""

# Check requirements
echo "[Step 1/5] Checking requirements..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm found: $NPM_VERSION"
echo ""

# Get project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "$PROJECT_DIR"

# Run deployment
echo "[Step 2/5] Running concurrent deployment orchestrator..."
echo ""

cd "$PROJECT_DIR"
node scripts/concurrent-deploy.js "$NETWORK"

DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
    echo ""
    print_error "Deployment failed with exit code $DEPLOY_EXIT_CODE"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure Hardhat is installed: npm install"
    echo "  2. Check that port 8545 is not in use"
    echo "  3. For Sepolia: ensure .env has SEPOLIA_RPC and PRIVATE_KEY"
    echo "  4. Check frontend dependencies: cd frontend && npm install"
    echo ""
    exit $DEPLOY_EXIT_CODE
fi

echo ""
print_header "=========================================================="
print_header "✅ Deployment Complete!"
print_header "=========================================================="
echo ""
print_info "Your app is now running:"
echo "  - Hardhat Node: Available in new terminal window 1"
echo "  - Webpack Dev Server starting in new terminal window 2"
echo "  - Browser will open at: http://localhost:3000"
echo ""
print_info "Next steps:"
echo "  1. Wait for React to compile (may take 1-2 minutes)"
echo "  2. Browser will auto-open to http://localhost:3000"
echo "  3. Connect MetaMask and test the app"
echo "  4. Check Hardhat terminal for blockchain events"
echo ""
print_warning "IMPORTANT:"
echo "  - Contract address has been auto-updated in config.js"
echo "  - Both terminals must stay running while you develop"
echo "  - Close terminals when done or press Ctrl+C"
echo ""
print_header "=========================================================="
echo ""
print_info "Detected OS: $MACHINE"
print_info "Network: $NETWORK"
print_info "Project Dir: $PROJECT_DIR"
echo ""
