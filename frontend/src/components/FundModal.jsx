import { useEffect, useState } from "react";
import { fundProject, getBalance } from "../utils/contractInteraction";

export const FundModal = ({ projectId, projectName, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [balance, setBalance] = useState("0");

  // Get account balance when modal opens
  const loadAccountBalance = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          const bal = await getBalance(accounts[0]);
          setBalance(bal);
        }
      }
    } catch (err) {
      console.error("Error loading balance:", err);
    }
  };

  useEffect(() => {
    loadAccountBalance();
  }, []);

  const validateAmount = () => {
    const amountNum = parseFloat(amount);

    if (!amount || amount.trim() === "") {
      setError("Please enter an amount");
      return false;
    }

    if (isNaN(amountNum)) {
      setError("Amount must be a valid number");
      return false;
    }

    if (amountNum <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    if (amountNum > 1000000) {
      setError("Amount is too large (maximum 1,000,000 ETH)");
      return false;
    }

    const balanceNum = parseFloat(balance);
    if (amountNum > balanceNum) {
      setError(
        `Insufficient balance. You have ${parseFloat(balance).toFixed(4)} ETH, but trying to send ${amountNum} ETH.`
      );
      return false;
    }

    return true;
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateAmount()) {
      return;
    }

    setIsLoading(true);

    try {
      await fundProject(projectId, amount);
      setAmount("");
      
      // Success message
      const txMessage = `✓ Successfully funded project with ${amount} ETH!`;
      onSuccess(txMessage);
      onClose();
    } catch (err) {
      let errorMessage = err.message || "Failed to fund project";

      // Handle common error cases
      if (errorMessage.includes("rejected")) {
        errorMessage = "Transaction rejected by user.";
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage =
          "Insufficient funds for transaction. Make sure you have enough ETH for the amount plus gas fees.";
      } else if (errorMessage.includes("Invalid project ID")) {
        errorMessage = "This project does not exist. Please check the project ID.";
      } else if (errorMessage.includes("Project already funded")) {
        errorMessage = "This project has already reached its funding goal.";
      } else if (errorMessage.includes("deadline")) {
        errorMessage = "The project deadline has passed.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fund Project</h2>
            <p className="text-gray-600 mt-1">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {balance && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Your Balance:</span> {parseFloat(balance).toFixed(4)} ETH
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (ETH) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.5"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum: 0.01 ETH | Maximum: {parseFloat(balance).toFixed(4)} ETH
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-2 font-semibold rounded-lg transition text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800"
              }`}
            >
              {isLoading ? "Processing..." : "Fund Project"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Gas fees will be added to your transaction amount
        </p>
      </div>
    </div>
  );
};
