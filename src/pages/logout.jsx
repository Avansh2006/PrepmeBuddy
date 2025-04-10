import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Logout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Start hidden, animate in
  const [isLoading, setIsLoading] = useState(false);

  // Animate modal in on mount
  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success("Logged out successfully!", {
        duration: 2000,
      });
      setTimeout(() => navigate("/login"), 500); // Slight delay for toast
    } catch (error) {
      toast.error("Logout failed. Please try again.", {
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setTimeout(() => navigate(-1), 300); // Delay to match animation
  };

  // Handle keyboard accessibility (Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showModal) {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {showModal && (
        <div
          className={`bg-white text-black rounded-xl p-6 shadow-xl max-w-sm w-full text-center space-y-6 transform transition-all duration-300 ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          role="dialog"
          aria-labelledby="logout-title"
          aria-modal="true"
        >
          {/* Header */}
          <h2
            id="logout-title"
            className="text-xl font-semibold text-gray-800"
          >
            Confirm Logout
          </h2>

          {/* Message */}
          <p className="text-gray-600">
            Are you sure you want to log out? Your progress will be saved.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`bg-red-600 text-white px-6 py-2 rounded-lg font-medium ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-700"
              } transition-colors duration-200`}
            >
              {isLoading ? "Logging Out..." : "Yes, Logout"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}