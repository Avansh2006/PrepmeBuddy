import React, { useState } from "react";

const Chatbot = () => {
  const [userGoal, setUserGoal] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [isBeginner, setIsBeginner] = useState(true);
  const [response, setResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "http://localhost:10000"; // 🔁 Replace with your backend URL

  const getRoadmap = async () => {
    if (!userGoal || !timeAvailable || !skillLevel) {
      setErrorMessage("⚠️ Please fill in all fields.");
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
    } catch (err) {
      console.error("Fetch error:", err);
      setResponse("❌ Error fetching roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">
          🚀 AI-Powered Roadmap Generator
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          Get a custom learning roadmap based on your goals and skill level.
        </p>

        <input
          type="text"
          placeholder="What is your goal? (e.g., Full Stack Developer)"
          value={userGoal}
          onChange={(e) => setUserGoal(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-600 rounded-md text-black bg-white"
        />

        <input
          type="number"
          placeholder="Hours you can dedicate weekly (e.g., 10)"
          value={timeAvailable}
          onChange={(e) => setTimeAvailable(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-600 rounded-md text-black bg-white"
        />

        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-600 rounded-md text-black bg-white"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <div className="flex items-center justify-start mb-4 gap-3">
          <label className="text-sm text-gray-200">
            Are you completely new to this field?
          </label>
          <input
            type="checkbox"
            checked={isBeginner}
            onChange={() => setIsBeginner(!isBeginner)}
            className="w-5 h-5"
          />
        </div>

        <button
          onClick={getRoadmap}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-base hover:bg-blue-700 transition"
        >
          Generate Roadmap
        </button>

        {errorMessage && (
          <p className="text-red-400 text-sm mt-4">{errorMessage}</p>
        )}

        {response && (
          <div
            id="response"
            className="mt-6 text-left bg-gray-700 rounded-md shadow-md p-5 text-white"
          >
            <div className="text-blue-400 font-bold text-sm uppercase mb-2">
              🎯 Personalized Roadmap
            </div>
            <div
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
