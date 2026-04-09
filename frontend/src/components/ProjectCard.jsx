import { useEffect, useState } from "react";
import { getProjectDetails, getUserContribution } from "../utils/contractInteraction";

export const ProjectCard = ({ projectId, account, onFundClick, onWithdrawClick }) => {
  const [project, setProject] = useState(null);
  const [contribution, setContribution] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchProjectData();
    const interval = setInterval(fetchProjectData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [projectId, account]);

  const fetchProjectData = async () => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError("");

      const details = await getProjectDetails(projectId);
      if (!details) {
        setError("Project not found");
        return;
      }

      setProject(details);

      if (account) {
        try {
          const userContribution = await getUserContribution(projectId, account);
          setContribution(userContribution);
        } catch (err) {
          console.warn("Could not fetch user contribution, using cached value:", err);
        }
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to load project details";
      setError(errorMessage);
      console.error("Project details error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProjectData();
  };

  const handleRemoveProject = () => {
    // This will be called if the project truly doesn't exist
    // The parent component will handle removal from the list
    if (onWithdrawClick && error && error.includes("not found")) {
      onWithdrawClick(projectId, "remove");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 mt-2">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    const isProjectNotFound = error && (error.includes("CALL_EXCEPTION") || error.includes("reverted"));
    
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className={`rounded-lg p-4 ${isProjectNotFound ? "bg-yellow-50 border border-yellow-200" : "bg-red-50 border border-red-200"}`}>
          <p className={`font-medium ${isProjectNotFound ? "text-yellow-700" : "text-red-700"}`}>
            {isProjectNotFound ? "Project Not Found" : "Error Loading Project"}
          </p>
          <p className={`text-sm mt-1 ${isProjectNotFound ? "text-yellow-600" : "text-red-600"}`}>
            {isProjectNotFound
              ? `Project #${projectId} does not exist yet. It may have been deleted or the ID is incorrect.`
              : error}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleRefresh}
              className={`px-3 py-1 text-white text-sm rounded transition ${
                isProjectNotFound
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isProjectNotFound ? "Refresh" : "Try Again"}
            </button>
            {isProjectNotFound && (
              <button
                onClick={handleRemoveProject}
                className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded transition"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (parseFloat(project.amountRaised) / parseFloat(project.fundingGoal)) * 100;
  const timeRemaining = Math.max(
    0,
    (project.deadlineTimestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isDeadlinePassed = timeRemaining <= 0;
  const isCreator = account && account.toLowerCase() === project.creator.toLowerCase();
  const userHasContributed = parseFloat(contribution) > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            <p className="text-gray-600 text-sm mt-1">
              By {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
              {isCreator && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">You</span>}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Refresh project data"
          >
            ↻
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-700">{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              project.funded ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Raised</p>
          <p className="font-bold text-lg text-gray-800">
            {parseFloat(project.amountRaised).toFixed(2)} ETH
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Goal</p>
          <p className="font-bold text-lg text-gray-800">
            {parseFloat(project.fundingGoal).toFixed(2)} ETH
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Your Contribution</p>
          <p className="font-bold text-gray-800">
            {parseFloat(contribution).toFixed(4)} ETH
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Status</p>
          <p className={`font-bold ${project.funded ? "text-green-600" : "text-orange-600"}`}>
            {project.funded ? "✓ Funded" : isDeadlinePassed ? "✗ Failed" : "⏳ Active"}
          </p>
        </div>
      </div>

      {/* Deadline Info */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50">
        {isDeadlinePassed ? (
          <p className="text-sm font-semibold text-red-600">⏰ Deadline Passed</p>
        ) : (
          <p className="text-sm font-semibold text-gray-700">
            ⏰ {timeRemaining.toFixed(1)} days remaining
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {!project.funded && !isDeadlinePassed && (
          <button
            onClick={() => onFundClick(projectId, project.name)}
            className="flex-1 min-w-32 px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg transition"
          >
            Fund Project
          </button>
        )}

        {isDeadlinePassed && !project.funded && userHasContributed && !isCreator && (
          <button
            onClick={() => onWithdrawClick(projectId, "user")}
            className="flex-1 min-w-32 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold rounded-lg transition"
          >
            ↓ Withdraw Contribution
          </button>
        )}

        {isDeadlinePassed && project.funded && isCreator && (
          <button
            onClick={() => onWithdrawClick(projectId, "admin")}
            className="flex-1 min-w-32 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-lg transition"
          >
            💰 Claim Funds
          </button>
        )}

        {!isDeadlinePassed && isDeadlinePassed && (
          <div className="w-full text-center">
            <p className="text-sm text-gray-500">
              {project.funded ? "Project funded! Awaiting claim." : "Project failed. Refunds available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
