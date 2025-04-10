import React, { useState, useEffect } from "react";

// Expanded question bank
const mockQuestions = [
  // Behavioral
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Describe a challenge you faced and how you overcame it.",
  "How do you handle conflict in a team?",
  // Technical (DSA/System Design)
  "Explain how you’d reverse a linked list.",
  "Design a URL shortener system.",
  "What’s the time complexity of quicksort?",
  // General
  "Why do you want to work at this company?",
  "How do you prioritize tasks under pressure?",
];

export default function MockInterview() {
  const [timer, setTimer] = useState(300); // 5 minutes per question
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // Store user answers
  const [userAnswer, setUserAnswer] = useState(""); // Current answer input
  const [showFeedback, setShowFeedback] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval;
    if (active && !paused && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      handleNextQuestion(); // Auto-move to next when time’s up
    }
    return () => clearInterval(interval);
  }, [active, paused, timer]);

  // Start interview
  const startInterview = () => {
    setCurrentQuestionIdx(0);
    setTimer(300);
    setAnswers([]);
    setUserAnswer("");
    setActive(true);
    setPaused(false);
    setShowFeedback(false);
  };

  // Submit answer and move to next question
  const handleNextQuestion = () => {
    if (userAnswer.trim()) {
      setAnswers((prev) => [
        ...prev,
        { question: mockQuestions[currentQuestionIdx], answer: userAnswer },
      ]);
    }
    if (currentQuestionIdx + 1 < mockQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setTimer(300);
      setUserAnswer("");
      setShowFeedback(false);
    } else {
      setActive(false); // End interview when questions run out
    }
  };

  // Simple feedback logic
  const getFeedback = () => {
    if (!userAnswer.trim()) return "No answer provided.";
    const wordCount = userAnswer.split(" ").length;
    if (wordCount < 10) return "Too short! Add more detail.";
    if (wordCount > 50) return "Great effort, but try to be concise.";
    return "Solid answer! Good balance of detail.";
  };

  // Reset interview
  const resetInterview = () => {
    setActive(false);
    setPaused(false);
    setTimer(300);
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setUserAnswer("");
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-teal-600 mb-6">
        Mock Interview
      </h1>

      {/* Main Content */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        {!active ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              Ready to practice? Hit start to begin!
            </p>
            <button
              onClick={startInterview}
              className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Question and Timer */}
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Question {currentQuestionIdx + 1}/{mockQuestions.length}:
              </p>
              <p className="text-gray-700 mb-4">
                {mockQuestions[currentQuestionIdx]}
              </p>
              <p
                className={`text-lg font-bold ${
                  timer <= 30 ? "text-red-600" : "text-teal-600"
                }`}
              >
                Time Left: {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            </div>

            {/* Answer Input */}
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-32"
            />

            {/* Feedback */}
            {showFeedback && (
              <p className="text-sm text-gray-600 italic">{getFeedback()}</p>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={() => setPaused(!paused)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={() => setShowFeedback(true)}
                disabled={!userAnswer.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                Check Feedback
              </button>
              <button
                onClick={handleNextQuestion}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                {currentQuestionIdx + 1 === mockQuestions.length
                  ? "Finish"
                  : "Next Question"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary (Post-Interview) */}
      {(!active && answers.length > 0) && (
        <div className="w-full max-w-2xl mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Interview Summary
          </h2>
          <p className="text-gray-700 mb-4">
            You answered {answers.length} out of {mockQuestions.length}{" "}
            questions.
          </p>
          <ul className="space-y-3">
            {answers.map((item, idx) => (
              <li key={idx} className="p-3 bg-gray-100 rounded-lg">
                <strong className="text-teal-600">Q:</strong> {item.question}
                <br />
                <strong className="text-teal-600">A:</strong> {item.answer}
              </li>
            ))}
          </ul>
          <button
            onClick={resetInterview}
            className="mt-4 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}