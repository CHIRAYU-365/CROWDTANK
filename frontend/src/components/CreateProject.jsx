import { useState } from "react";
import { createProject, isProjectIdUsed } from "../utils/contractInteraction";

export const CreateProject = ({ onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fundingGoal: "",
    duration: "7",
    projectId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = async () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Project name must be at least 3 characters";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Project name must be less than 100 characters";
    }

    // Validate description
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    // Validate funding goal
    const fundingGoal = parseFloat(formData.fundingGoal);
    if (!formData.fundingGoal) {
      errors.fundingGoal = "Funding goal is required";
    } else if (isNaN(fundingGoal)) {
      errors.fundingGoal = "Funding goal must be a valid number";
    } else if (fundingGoal <= 0) {
      errors.fundingGoal = "Funding goal must be greater than 0";
    } else if (fundingGoal > 1000000) {
      errors.fundingGoal = "Funding goal must be less than 1,000,000 ETH";
    }

    // Validate duration
    const duration = parseInt(formData.duration);
    if (!formData.duration) {
      errors.duration = "Duration is required";
    } else if (isNaN(duration)) {
      errors.duration = "Duration must be a valid number";
    } else if (duration <= 0) {
      errors.duration = "Duration must be at least 1 day";
    } else if (duration > 365) {
      errors.duration = "Duration must be less than 365 days";
    }

    // Validate project ID
    if (!formData.projectId) {
      errors.projectId = "Project ID is required";
    } else {
      const projectId = parseInt(formData.projectId);
      if (isNaN(projectId) || projectId <= 0) {
        errors.projectId = "Project ID must be a positive number";
      } else {
        try {
          const isUsed = await isProjectIdUsed(projectId);
          if (isUsed) {
            errors.projectId = "This project ID is already used. Please choose a different ID.";
          }
        } catch (err) {
          console.error("Error checking project ID:", err);
          errors.projectId = "Unable to verify project ID. Please check your connection and try again.";
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    const isValid = await validateForm();
    if (!isValid) {
      setError("Please fix the errors above before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const durationSeconds = parseInt(formData.duration) * 24 * 60 * 60;
      const projectId = parseInt(formData.projectId);

      const receipt = await createProject(
        formData.name.trim(),
        formData.description.trim(),
        formData.fundingGoal,
        durationSeconds,
        projectId
      );

      setSuccess(
        `✓ Project created successfully!\nTransaction: ${receipt.transactionHash.slice(0, 10)}...`
      );
      setFormData({
        name: "",
        description: "",
        fundingGoal: "",
        duration: "7",
        projectId: "",
      });
      setFieldErrors({});

      if (onProjectCreated) {
        onProjectCreated(projectId);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to create project";
      setError(errorMessage);
      
      // Handle specific contract errors
      if (errorMessage.includes("insufficient")) {
        setError("Insufficient balance to create project. You need some ETH for gas fees.");
      } else if (errorMessage.includes("rejected")) {
        setError("Transaction rejected by user.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a New Project</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700 font-medium">Error</p>
          <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-700 font-medium">Success</p>
          <p className="text-sm text-green-600 whitespace-pre-wrap">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Build a DAO"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.name ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {fieldErrors.name && <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project... (10-500 characters)"
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.description ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {fieldErrors.description ? (
              <p className="text-sm text-red-600">{fieldErrors.description}</p>
            ) : (
              <p className="text-xs text-gray-500">
                {formData.description.length} / 500 characters
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Funding Goal (ETH) *
            </label>
            <input
              type="number"
              name="fundingGoal"
              value={formData.fundingGoal}
              onChange={handleChange}
              placeholder="e.g., 10"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                fieldErrors.fundingGoal ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.fundingGoal && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.fundingGoal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (Days) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 7"
              min="1"
              max="365"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                fieldErrors.duration ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.duration && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.duration}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Project ID *</label>
          <input
            type="number"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            placeholder="Unique project ID (e.g., 1)"
            min="1"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.projectId ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {fieldErrors.projectId && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.projectId}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Must be unique and not previously used</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isLoading ? "Creating Project..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};
