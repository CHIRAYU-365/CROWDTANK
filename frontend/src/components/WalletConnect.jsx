import { useEffect, useState } from "react";
import { connectWallet, getBalance, getConnectedAccount } from "../utils/contractInteraction";

export const WalletConnect = ({ onAccountChange }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  useEffect(() => {
    checkConnectedAccount();
    setupEthereumListeners();
  }, []);

  const setupEthereumListeners = () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask to use this application.");
      return;
    }

    window.ethereum.on("accountsChanged", (accounts) => {
      setError(null);
      if (accounts.length === 0) {
        setAccount(null);
        setBalance("0");
        onAccountChange(null);
      } else {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
        onAccountChange(accounts[0]);
      }
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  };

  const checkConnectedAccount = async () => {
    try {
      setError(null);
      const connectedAccount = await getConnectedAccount();
      if (connectedAccount) {
        setAccount(connectedAccount);
        fetchBalance(connectedAccount);
        onAccountChange(connectedAccount);
      }
    } catch (error) {
      const message = error.message || "Failed to check connected account";
      console.error("Error checking connected account:", error);
      setError(message);
    }
  };

  const fetchBalance = async (accountAddress) => {
    if (!accountAddress) return;
    setIsBalanceLoading(true);
    try {
      const bal = await getBalance(accountAddress);
      setBalance(bal);
      setError(null);
    } catch (error) {
      const message = error.message || "Failed to fetch balance";
      console.error("Error fetching balance:", error);
      // Don't show balance error if account is connected, just use cached value
      if (!account) {
        setError(message);
      }
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask to use this application.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      await fetchBalance(connectedAccount);
      onAccountChange(connectedAccount);
    } catch (error) {
      const message = error.message || "Failed to connect wallet";
      console.error("Connection error:", error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (account) {
    return (
      <div className="space-y-2">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Connected Account</p>
              <p className="font-mono text-sm font-semibold text-green-700">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-semibold text-green-700">
                {isBalanceLoading ? "Loading..." : `${parseFloat(balance).toFixed(4)} ETH`}
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};
