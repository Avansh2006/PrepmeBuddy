import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const DSAPlayground = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [language, setLanguage] = useState("javascript"); // Default language
  const [question, setQuestion] = useState(""); // Current question
  const [testCases, setTestCases] = useState([]); // Test cases for the question
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer state

  const apiKey = import.meta.env.VITE_GEMENI_API_KEY; // Use environment variable for security

  // Hardcoded questions (from LeetCode)
  const questions = [
    {
      question: "Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      testCases: ["Input: nums = [2,7,11,15], target = 9; Output: [0,1]", "Input: nums = [3,2,4], target = 6; Output: [1,2]"],
    },
    {
      question: "Reverse Integer: Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, return 0.",
      testCases: ["Input: x = 123; Output: 321", "Input: x = -123; Output: -321"],
    },
    {
      question: "Palindrome Number: Given an integer x, return true if x is a palindrome, and false otherwise.",
      testCases: ["Input: x = 121; Output: true", "Input: x = -121; Output: false"],
    },
    {
      question: "Longest Substring Without Repeating Characters: Given a string s, find the length of the longest substring without repeating characters.",
      testCases: ["Input: s = 'abcabcbb'; Output: 3", "Input: s = 'bbbbb'; Output: 1"],
    },
    {
      question: "Container With Most Water: Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai), find two lines that together with the x-axis form a container, such that the container contains the most water.",
      testCases: ["Input: height = [1,8,6,2,5,4,8,3,7]; Output: 49"],
    },
    {
      question: "Valid Parentheses: Given a string s containing just the characters '(', ')', '{', '}', '[', ']', determine if the input string is valid.",
      testCases: ["Input: s = '()'; Output: true", "Input: s = '(]'; Output: false"],
    },
    {
      question: "Merge Two Sorted Lists: Merge two sorted linked lists and return it as a sorted list.",
      testCases: ["Input: l1 = [1,2,4], l2 = [1,3,4]; Output: [1,1,2,3,4,4]"],
    },
    {
      question: "Climbing Stairs: You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      testCases: ["Input: n = 2; Output: 2", "Input: n = 3; Output: 3"],
    },
    {
      question: "Maximum Subarray: Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum.",
      testCases: ["Input: nums = [-2,1,-3,4,-1,2,1,-5,4]; Output: 6"],
    },
    {
      question: "Search Insert Position: Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
      testCases: ["Input: nums = [1,3,5,6], target = 5; Output: 2"],
    },
    {
      question: "Plus One: Given a non-empty array of decimal digits representing a non-negative integer, increment one to the integer.",
      testCases: ["Input: digits = [1,2,3]; Output: [1,2,4]"],
    },
    {
      question: "Binary Tree Inorder Traversal: Given the root of a binary tree, return its inorder traversal.",
      testCases: ["Input: root = [1,null,2,3]; Output: [1,3,2]"],
    },
    {
      question: "Symmetric Tree: Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
      testCases: ["Input: root = [1,2,2,3,4,4,3]; Output: true"],
    },
    {
      question: "Maximum Depth of Binary Tree: Given the root of a binary tree, return its maximum depth.",
      testCases: ["Input: root = [3,9,20,null,null,15,7]; Output: 3"],
    },
    {
      question: "Best Time to Buy and Sell Stock: You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve.",
      testCases: ["Input: prices = [7,1,5,3,6,4]; Output: 5"],
    },
    {
      question: "Valid Anagram: Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      testCases: ["Input: s = 'anagram', t = 'nagaram'; Output: true"],
    },
    {
      question: "Linked List Cycle: Given head, the head of a linked list, determine if the linked list has a cycle in it.",
      testCases: ["Input: head = [3,2,0,-4], pos = 1; Output: true"],
    },
    {
      question: "Find Minimum in Rotated Sorted Array: Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element.",
      testCases: ["Input: nums = [3,4,5,1,2]; Output: 1"],
    },
    {
      question: "Combination Sum: Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.",
      testCases: ["Input: candidates = [2,3,6,7], target = 7; Output: [[2,2,3],[7]]"],
    },
    {
      question: "Word Search: Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      testCases: ["Input: board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'; Output: true"],
    },
  ];

  // Select a random question
  const selectRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex].question);
    setTestCases(questions[randomIndex].testCases);
  };

  // Run the code and get output, feedback, and score from Gemini API
  const runCode = async () => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Evaluate the following code for the question: "${question}". Use the test cases: ${JSON.stringify(
                      testCases
                    )}. Provide detailed feedback in 50 words or less, including scopes of improvement and flaws in the code, based on code quality, efficiency, and correctness.\n\nCode:\n${code}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 512,
            },
          }),
        }
      );

      const data = await res.json();
      const generatedOutput =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Failed to evaluate the code. Please try again.";

      console.log("Generated Output:", generatedOutput); // Debugging: Log the API response

      // Handle feedback extraction
      if (generatedOutput && generatedOutput.length > 0) {
        const cleanedFeedback = generatedOutput
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Replace `**` with bold HTML tags
          .split(" ")
          .slice(0, 50) // Limit feedback to 50 words
          .join(" ");
        setFeedback(cleanedFeedback);
      } else {
        console.warn("No feedback found in response."); // Debugging: Log missing feedback
        setFeedback("No feedback received.");
      }
    } catch (error) {
      console.error("Error running code:", error);
      setFeedback("Error running code. Please try again.");
    }
  };

  // Handle timer selection
  const handleTimerSelection = (minutes) => {
    setTimer(minutes * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
  };

  // Timer countdown logic
  useEffect(() => {
    let timerInterval;
    if (isTimerRunning && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      clearInterval(timerInterval);
      setIsTimerRunning(false);
      runCode(); // Auto-submit the code when the timer ends
    }
    return () => clearInterval(timerInterval);
  }, [timer, isTimerRunning]);

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    selectRandomQuestion(); // Select a random question when the component loads
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>DSA Playground</h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>Question</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{question}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Test Cases</h3>
        <ul>
          {testCases.map((testCase, index) => (
            <li key={index}>{testCase}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="language-select" style={{ marginRight: "10px" }}>
          Select Language:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "5px",
            fontSize: "16px",
            backgroundColor: "#4a4a4a", // Grey background
            color: "#ffffff", // White font color
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
      <Editor
        height="400px"
        language={language}
        defaultValue={
          language === "javascript"
            ? "// Write your JavaScript code here..."
            : language === "cpp"
            ? "// Write your C++ code here..."
            : language === "java"
            ? "// Write your Java code here..."
            : language === "python"
            ? "# Write your Python code here..."
            : ""
        }
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={runCode} style={{ marginRight: "10px" }}>
          Run Code
        </button>
      </div>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <h3>Timer</h3>
          <div style={{ marginBottom: "10px" }}>
            <button onClick={() => handleTimerSelection(5)} style={{ marginRight: "10px" }}>
              5 Minutes
            </button>
            <button onClick={() => handleTimerSelection(10)} style={{ marginRight: "10px" }}>
              10 Minutes
            </button>
            <button onClick={() => handleTimerSelection(15)}>15 Minutes</button>
          </div>
          {isTimerRunning && <p>Time Remaining: {formatTime(timer)}</p>}
        </div>
        <div>
          <h3>Feedback</h3>
          <pre
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: feedback }}
          ></pre>
        </div>
      </div>
    </div>
  );
};

export default DSAPlayground;
