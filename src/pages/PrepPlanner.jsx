import React, { useState } from "react";

// Initial plans with multiple companies
const initialPlans = {
  Amazon: [
    { week: 1, DSA: "Arrays", HR: "Intro", completed: false },
    { week: 2, DSA: "Trees", HR: "Behavioral", completed: false },
    { week: 3, DSA: "Graphs", HR: "Strengths & Weaknesses", completed: false },
  ],
  Google: [
    { week: 1, DSA: "Hash Maps", HR: "Teamwork", completed: false },
    { week: 2, DSA: "Dynamic Programming", HR: "Leadership", completed: false },
    { week: 3, DSA: "System Design Basics", HR: "Problem Solving", completed: false },
  ],
  Microsoft: [
    { week: 1, DSA: "Linked Lists", HR: "Communication", completed: false },
    { week: 2, DSA: "Stacks & Queues", HR: "Adaptability", completed: false },
    { week: 3, DSA: "Binary Search", HR: "Culture Fit", completed: false },
  ],
};

export default function PrepPlanner() {
  const [company, setCompany] = useState("Amazon");
  const [plans, setPlans] = useState(initialPlans);
  const [newWeek, setNewWeek] = useState({ DSA: "", HR: "" });
  const [showForm, setShowForm] = useState(false); // Toggle add week form

  // Toggle completion status
  const toggleComplete = (week) => {
    setPlans((prev) => ({
      ...prev,
      [company]: prev[company].map((item) =>
        item.week === week ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Add a new week
  const addWeek = () => {
    if (!newWeek.DSA.trim() || !newWeek.HR.trim()) {
      alert("Please enter both DSA and HR topics!");
      return;
    }
    const newWeekNum = plans[company].length + 1;
    setPlans((prev) => ({
      ...prev,
      [company]: [
        ...prev[company],
        { week: newWeekNum, DSA: newWeek.DSA, HR: newWeek.HR, completed: false },
      ],
    }));
    setNewWeek({ DSA: "", HR: "" });
    setShowForm(false); // Hide form after adding
  };

  // Calculate progress
  const completedWeeks = plans[company].filter((item) => item.completed).length;
  const totalWeeks = plans[company].length;
  const progressPercent = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-teal-600 mb-6">
        Prep Planner
      </h1>

      {/* Company Selector */}
      <div className="w-full max-w-lg mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Select Company:
        </label>
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          {Object.keys(plans).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-6">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Progress: {completedWeeks}/{totalWeeks} ({Math.round(progressPercent)}%)
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Plan Display */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Plan for {company}
        </h2>
        {plans[company]?.length > 0 ? (
          <ul className="space-y-3">
            {plans[company].map((item) => (
              <li
                key={item.week}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.completed ? "bg-teal-50" : "bg-gray-100"
                } hover:bg-gray-200 transition-colors`}
              >
                <div>
                  <strong className="text-lg">Week {item.week}</strong>:{" "}
                  <span className="text-gray-700">
                    {item.DSA} + HR - {item.HR}
                  </span>
                </div>
                <button
                  onClick={() => toggleComplete(item.week)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.completed
                      ? "bg-teal-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  } hover:scale-105 transition-transform`}
                >
                  {item.completed ? "Done" : "Mark Done"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No plan available yet!</p>
        )}
      </div>

      {/* Add New Week Section */}
      <div className="w-full max-w-lg">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors mb-4"
        >
          {showForm ? "Hide Form" : "Add a New Week"}
        </button>
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              New Week Details
            </h3>
            <input
              type="text"
              value={newWeek.DSA}
              onChange={(e) => setNewWeek({ ...newWeek, DSA: e.target.value })}
              placeholder="DSA Topic (e.g., Sorting)"
              className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newWeek.HR}
              onChange={(e) => setNewWeek({ ...newWeek, HR: e.target.value })}
              placeholder="HR Focus (e.g., Teamwork)"
              className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              onClick={addWeek}
              className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Add Week
            </button>
          </div>
        )}
      </div>
    </div>
  );
}