import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

// Validation helper
const validateContractAddress = () => {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0" || CONTRACT_ADDRESS === "0x") {
    throw new Error(
      "Contract address not configured. Please update CONTRACT_ADDRESS in src/config.js with your deployed contract address."
    );
  }
};

const validateEthereumProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask to use this application.");
  }
};

// Get provider
export const getProvider = () => {
  validateEthereumProvider();
  return new ethers.providers.Web3Provider(window.ethereum);
};

// Get signer
export const getSigner = async () => {
  const provider = getProvider();
  return provider.getSigner();
};

// Get contract instance for writing
export const getContract = async () => {
  validateContractAddress();
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Get contract instance for reading (no signer needed)
export const getContractRead = async () => {
  validateContractAddress();
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Connect wallet
export const connectWallet = async () => {
  try {
    validateEthereumProvider();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found for connection");
    }
    return accounts[0];
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("User rejected the connection request");
    }
    throw new Error(error.message || "Failed to connect wallet");
  }
};

// Get connected account
export const getConnectedAccount = async () => {
  try {
    validateEthereumProvider();
    const provider = getProvider();
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting connected account:", error);
    return null;
  }
};

// Create project
export const createProject = async (name, description, fundingGoal, duration, projectId) => {
  try {
    if (!name || !description) {
      throw new Error("Project name and description are required");
    }
    if (fundingGoal <= 0) {
      throw new Error("Funding goal must be greater than 0");
    }
    if (duration <= 0) {
      throw new Error("Duration must be greater than 0");
    }
    if (!projectId || projectId <= 0) {
      throw new Error("Project ID must be a valid positive number");
    }

    const contract = await getContract();
    const tx = await contract.createProject(
      name,
      description,
      ethers.utils.parseEther(fundingGoal.toString()),
      Math.floor(duration),
      Math.floor(projectId)
    );
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    const message = error.reason || error.message || "Failed to create project";
    throw new Error(message);
  }
};

// Fund project
export const fundProject = async (projectId, amount) => {
  try {
    if (!projectId || projectId <= 0) {
      throw new Error("Invalid project ID");
    }
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const contract = await getContract();
    const tx = await contract.fundProject(Math.floor(projectId), {
      value: ethers.utils.parseEther(amount.toString()),
    });
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    const message = error.reason || error.message || "Failed to fund project";
    throw new Error(message);
  }
};

// Get project details
export const getProjectDetails = async (projectId) => {
  try {
    if (!projectId || projectId <= 0) {
      throw new Error("Invalid project ID");
    }

    const contract = await getContractRead();
    const project = await contract.getProject(Math.floor(projectId));
    return {
      creator: project.creator,
      name: project.name,
      description: project.description,
      fundingGoal: ethers.utils.formatEther(project.fundingGoal),
      deadline: new Date(project.deadline.toNumber() * 1000),
      amountRaised: ethers.utils.formatEther(project.amountRaised),
      funded: project.funded,
      deadlineTimestamp: project.deadline.toNumber(),
    };
  } catch (error) {
    // Handle specific error cases
    if (error.code === "CALL_EXCEPTION" || error.reason === null) {
      throw new Error(`Project #${projectId} not found or does not exist on the contract.`);
    }
    const message = error.reason || error.message || "Failed to fetch project details";
    throw new Error(message);
  }
};

// Get user contribution
export const getUserContribution = async (projectId, userAddress) => {
  try {
    if (!projectId || projectId <= 0) {
      throw new Error("Invalid project ID");
    }
    if (!userAddress || !ethers.utils.isAddress(userAddress)) {
      throw new Error("Invalid user address");
    }

    const contract = await getContractRead();
    const contribution = await contract.getContribution(Math.floor(projectId), userAddress);
    return ethers.utils.formatEther(contribution);
  } catch (error) {
    console.error("Error fetching contribution:", error);
    return "0";
  }
};

// Check if project ID is used
export const isProjectIdUsed = async (projectId) => {
  try {
    if (!projectId || projectId <= 0) {
      throw new Error("Invalid project ID");
    }

    const contract = await getContractRead();
    return await contract.isIdUsedCall(Math.floor(projectId));
  } catch (error) {
    console.error("Error checking project ID:", error);
    return false;
  }
};

// User withdraw funds
export const userWithdrawFunds = async (projectId) => {
  try {
    if (!projectId || projectId <= 0) {
      throw new Error("Invalid project ID");
    }

    const contract = await getContract();
    const tx = await contract.userWithdrawFunds(Math.floor(projectId));
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    const message = error.reason || error.message || "Failed to withdraw funds";
    throw new Error(message);
  }
};

// Admin withdraw funds
export const adminWithdrawFunds = async (projectId) => {
  try {
    if (!projectId || projectId <= 0) {
      throw new Error("Invalid project ID");
    }

    const contract = await getContract();
    const tx = await contract.adminWithdrawFunds(Math.floor(projectId));
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    const message = error.reason || error.message || "Failed to claim funds";
    throw new Error(message);
  }
};

// Get account balance
export const getBalance = async (address) => {
  try {
    if (!address || !ethers.utils.isAddress(address)) {
      throw new Error("Invalid address");
    }

    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
};

