// Contract configuration
// Update CONTRACT_ADDRESS after deploying to localhost or testnet
// 
// To get the contract address:
// 1. Make sure Hardhat node is running: npx hardhat node
// 2. In another terminal, run: npx hardhat run scripts/test-deploy.js --network localhost
// 3. Copy the contract address (0x...) from the output
// 4. Paste it below, replacing the placeholder address

// ⚠️  MUST UPDATE with actual deployed contract address
// Replace with your real contract address from deployment
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CHAIN_ID = 31337; // Hardhat localhost chain ID (1 for Ethereum mainnet, 11155111 for Sepolia)

export const CHAIN_NAME = "Hardhat (Localhost)";

// Add check for contract address
if (CONTRACT_ADDRESS === "0x0" || CONTRACT_ADDRESS === "0x") {
  console.warn(
    "⚠️  CONTRACT_ADDRESS is not properly configured in config.js. Please update it with your deployed contract address."
  );
}

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "_durationSeconds", "type": "uint256" },
      { "internalType": "uint256", "name": "_id", "type": "uint256" }
    ],
    "name": "createProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_projectId", "type": "uint256" }],
    "name": "fundProject",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_projectId", "type": "uint256" }],
    "name": "userWithdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_projectId", "type": "uint256" }],
    "name": "adminWithdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_projectId", "type": "uint256" }],
    "name": "getProject",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "fundingGoal", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint256", "name": "amountRaised", "type": "uint256" },
          { "internalType": "bool", "name": "funded", "type": "bool" }
        ],
        "internalType": "struct CrowdTank.Project",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_projectId", "type": "uint256" },
      { "internalType": "address", "name": "_contributor", "type": "address" }
    ],
    "name": "getContribution",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "isIdUsedCall",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "ProjectCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "contributor", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "ProjectFunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "withdrawer", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "string", "name": "withdrawerType", "type": "string" }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  }
];
