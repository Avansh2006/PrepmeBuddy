import React, { useState } from "react";

const Chatbot = () => {
  const [userGoal, setUserGoal] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [isBeginner, setIsBeginner] = useState(true);
  const [response, setResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // Store past roadmaps

  const backendURL = "http://localhost:10000"; // Replace with your backend URL

  const getRoadmap = async () => {
    if (!userGoal.trim() || !timeAvailable || !skillLevel) {
      setErrorMessage("⚠️ Please fill in all fields.");
      setResponse("");
      return;
    }
    if (parseInt(timeAvailable) <= 0) {
      setErrorMessage("⚠️ Time available must be greater than 0.");
      setResponse("");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    setResponse("⏳ Generating your personalized roadmap... Please wait.");

    try {
      const res = await fetch(`${backendURL}/generate-roadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userGoal,
          timeAvailable,
          skillLevel,
          isBeginner,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      let formatted = data.advice
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/•\s?(.*?)(\n|$)/g, "<li>$1</li>")
        .replace(/\n/g, "<br>");

      setResponse(formatted);
      setHistory((prev) => [
        ...prev,
        { goal: userGoal, time: timeAvailable, level: skillLevel, roadmap: formatted },
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
      setResponse("❌ Error fetching roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserGoal("");
    setTimeAvailable("");
    setSkillLevel("beginner");
    setIsBeginner(true);
    setResponse("");
    setErrorMessage("");
  };

  const copyToClipboard = () => {
    const text = response.replace(/<[^>]+>/g, ""); // Strip HTML tags
    navigator.clipboard.writeText(text);
    setErrorMessage("✅ Roadmap copied to clipboard!");
    setTimeout(() => setErrorMessage(""), 2000); // Clear after 2s
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            🚀 AI-Powered Roadmap Generator
          </h1>
          <p className="text-sm text-gray-300">
            Get a custom learning roadmap tailored to your goals.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your goal (e.g., Full Stack Developer)"
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            className="w-full p-3 rounded-md bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Hours/week (e.g., 10)"
            value={timeAvailable}
            onChange={(e) => setTimeAvailable(e.target.value)}
            min="1"
            className="w-full p-3 rounded-md bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          />

          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full p-3 rounded-md bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-200">
              New to this field?
            </label>
            <input
              type="checkbox"
              checked={isBeginner}
              onChange={() => setIsBeginner(!isBeginner)}
              className="w-5 h-5 text-blue-600 border-gray-600 rounded"
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={getRoadmap}
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              } transition-all`}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
            <button
              onClick={resetForm}
              className="w-full bg-gray-600 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Feedback */}
        {errorMessage && (
          <p className="text-red-400 text-sm text-center">{errorMessage}</p>
        )}

        {/* Response */}
        {response && (
          <div className="mt-6 bg-gray-700 rounded-md shadow-md p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-bold text-sm uppercase">
                🎯 Personalized Roadmap
              </span>
              <button
                onClick={copyToClipboard}
                className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <div
              className="text-base leading-relaxed text-gray-200"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Past Roadmaps</h3>
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-md shadow-md text-sm text-gray-300"
              >
                <p>
                  <b>Goal:</b> {item.goal} | <b>Time:</b> {item.time} hrs/week |{" "}
                  <b>Level:</b> {item.level}
                </p>
                <button
                  onClick={() => setResponse(item.roadmap)}
                  className="mt-2 text-blue-400 hover:underline"
                >
                  View Again
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;