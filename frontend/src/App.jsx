import { useState } from "react";
import { CreateProject } from "./components/CreateProject";
import { FundModal } from "./components/FundModal";
import { ProjectCard } from "./components/ProjectCard";
import { WalletConnect } from "./components/WalletConnect";
import { adminWithdrawFunds, userWithdrawFunds } from "./utils/contractInteraction";

export const App = () => {
  const [account, setAccount] = useState(null);
  const [projects, setProjects] = useState([]); // Start empty - only show projects that actually exist
  const [fundModalData, setFundModalData] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
  };

  const handleProjectCreated = (projectId) => {
    if (!projects.includes(projectId)) {
      setProjects([...projects, projectId]);
    }
    showMessage("✓ Project created successfully! It may take a moment to appear.", "success");
  };

  const handleFundClick = (projectId, projectName) => {
    if (!account) {
      showMessage("⚠ Please connect your wallet first", "error");
      return;
    }
    setFundModalData({ projectId, projectName });
  };

  const handleFundSuccess = (successMessage) => {
    showMessage(successMessage || "✓ Project funded successfully!", "success");
  };

  const handleWithdrawClick = async (projectId, type) => {
    // Handle project removal if it doesn't exist
    if (type === "remove") {
      setProjects(projects.filter(p => p !== projectId));
      showMessage(`Project #${projectId} removed from list (doesn't exist on contract)`, "success");
      return;
    }

    if (!account) {
      showMessage("⚠ Please connect your wallet first", "error");
      return;
    }

    setWithdrawLoading(true);
    try {
      if (type === "user") {
        await userWithdrawFunds(projectId);
        showMessage("✓ Funds withdrawn successfully!", "success");
      } else if (type === "admin") {
        await adminWithdrawFunds(projectId);
        showMessage("✓ Funds claimed successfully!", "success");
      }
    } catch (error) {
      let errorMessage = error.message || "An unknown error occurred";

      // Handle specific errors
      if (errorMessage.includes("rejected")) {
        errorMessage = "⚠ Transaction rejected by user";
      } else if (errorMessage.includes("insufficient")) {
        errorMessage = "⚠ Insufficient funds for gas fees";
      } else if (errorMessage.includes("not the creator")) {
        errorMessage = "⚠ Only the project creator can claim funds";
      } else if (errorMessage.includes("no contribution")) {
        errorMessage = "⚠ No contribution found to withdraw";
      } else if (errorMessage.includes("already funded")) {
        errorMessage = "⚠ Cannot withdraw from a funded project";
      } else if (errorMessage.includes("deadline")) {
        errorMessage = "⚠ Deadline actions not available at this time";
      }

      showMessage(errorMessage, "error");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    const duration = type === "error" ? 5000 : 3000;
    setTimeout(() => setMessage(""), duration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white">🚀 CrowdTank</h1>
              <p className="text-slate-400 text-sm">Decentralized Crowdfunding Platform</p>
            </div>
            <div className="w-full sm:w-80">
              <WalletConnect onAccountChange={handleAccountChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 rounded-lg p-4 border transition-all animate-fade-in ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
            role="alert"
          >
            <p className="font-medium">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {!account ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">
                  💡 Connect your wallet to create projects and fund them!
                </p>
              </div>
            ) : (
              <CreateProject onProjectCreated={handleProjectCreated} />
            )}
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">All Projects</h2>
              <p className="text-slate-400">Browse and support crowdfunding projects</p>
            </div>

            {projects.length === 0 ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600">
                <p className="text-slate-300 text-lg font-semibold mb-2">🚀 No Projects Yet</p>
                <p className="text-slate-400 mb-4">
                  {account
                    ? "Be the first to create a crowdfunding project!"
                    : "Connect your wallet and create the first project on CrowdTank."}
                </p>
                {!account && (
                  <p className="text-slate-500 text-sm">
                    Once connected, use the form on the left to start a new project.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {projects.map((projectId) => (
                  <ProjectCard
                    key={projectId}
                    projectId={projectId}
                    account={account}
                    onFundClick={handleFundClick}
                    onWithdrawClick={handleWithdrawClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fund Modal */}
      {fundModalData && (
        <FundModal
          projectId={fundModalData.projectId}
          projectName={fundModalData.projectName}
          onClose={() => setFundModalData(null)}
          onSuccess={handleFundSuccess}
        />
      )}

      {/* Loading Overlay for Withdraw */}
      {withdrawLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700 font-medium">Processing transaction...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-sm text-center">
            CrowdTank © 2024 • Built with React & Solidity
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
