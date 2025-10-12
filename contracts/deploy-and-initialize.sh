#!/bin/bash

# 🚀 Lypto Solana Contract - Complete Deployment Script
# This script deploys the contract to devnet and initializes it

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  LYPTO Solana Contract Deployment  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""

# Add Solana to PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Navigate to contracts directory
cd "$(dirname "$0")"

# Check Solana config
echo -e "${YELLOW}📍 Checking Solana configuration...${NC}"
solana config get
echo ""

# Check wallet balance
echo -e "${YELLOW}💰 Checking wallet balance...${NC}"
BALANCE=$(solana balance | awk '{print $1}')
echo "Balance: $BALANCE SOL"
echo ""

# Check if we have enough SOL
if (( $(echo "$BALANCE < 2.5" | bc -l) )); then
  echo -e "${RED}❌ Insufficient balance!${NC}"
  echo ""
  echo "You need at least 2.5 SOL for deployment."
  echo ""
  echo "Get more SOL from:"
  echo "  - https://faucet.solana.com/"
  echo "  - https://solfaucet.com/"
  echo ""
  echo "Or run: solana airdrop 1"
  echo ""
  exit 1
fi

# Deploy the program
echo -e "${YELLOW}🚀 Deploying program to devnet...${NC}"
echo ""
anchor deploy --provider.cluster devnet

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Deployment failed!${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Program deployed successfully!${NC}"
echo ""

# Get the deployed program ID
PROGRAM_ID=$(solana address -k target/deploy/contracts-keypair.json)
echo -e "Program ID: ${GREEN}$PROGRAM_ID${NC}"
echo ""

# Initialize the program
echo -e "${YELLOW}🔧 Initializing LYPTO mint...${NC}"
echo ""

# Run the initialization script
ts-node scripts/initialize.ts

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Initialization failed!${NC}"
  echo ""
  echo "You can manually initialize later by running:"
  echo "  cd contracts && ts-node scripts/initialize.ts"
  echo ""
  exit 1
fi

echo ""
echo -e "${GREEN}✅ LYPTO mint initialized!${NC}"
echo ""

# Get LYPTO mint address
LYPTO_MINT=$(solana address -k <(echo '[$(jq -c '.address' target/idl/contracts.json)]'))

# Display summary
echo -e "${GREEN}╔═══════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Deployment Complete! 🎉       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════╝${NC}"
echo ""
echo "Program ID:      $PROGRAM_ID"
echo "LYPTO Mint:      Check initialization logs above"
echo "Network:         Devnet"
echo "RPC:             https://api.devnet.solana.com"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. Update backend/.env with MERCHANT_SOLANA_PRIVATE_KEY"
echo "2. Restart backend: cd backend && bun run index.ts"
echo "3. Test payment flow from merchant app"
echo ""
echo -e "${GREEN}View on Solana Explorer:${NC}"
echo "  https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
echo -e "${GREEN}View program logs:${NC}"
echo "  solana logs $PROGRAM_ID"
echo ""

