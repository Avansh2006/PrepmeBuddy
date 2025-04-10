// src/pages/CodingPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function CodingPage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("// Write your code here\nconsole.log('Hello!');");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const docRef = doc(db, "adminChallenges", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChallenge(docSnap.data());
        } else {
          console.error("Challenge not found!");
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
      }
    };

    if (id) fetchChallenge();
  }, [id]);

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const submission = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: 63, // JavaScript
          source_code: code,
          stdin: "",
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "YOUR_RAPID_API_KEY", // Replace with your key
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = submission.data.token;

      // Wait for Judge0 to process submission
      let result = {};
      while (!result.stdout && !result.stderr && !result.compile_output) {
        const poll = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": "YOUR_RAPID_API_KEY", // Replace with your key
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = poll.data;
        await new Promise((r) => setTimeout(r, 1500));
      }

      setOutput(result.stdout || result.stderr || result.compile_output || "No output.");
    } catch (error) {
      console.error("Code Execution Error:", error);
      setOutput("Something went wrong while executing the code.");
    }

    setLoading(false);
  };

  if (!challenge) return <div className="p-6">Loading challenge...</div>;

  return (
    <div className="p-6 space-y-6 text-black">
      <h1 className="text-3xl font-bold text-purple-600">{challenge.title}</h1>
      <p className="text-gray-700">{challenge.description}</p>
      <p className="text-sm text-gray-500 italic">Hint: {challenge.hint}</p>

      <Editor
        height="400px"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />

      <Button onClick={runCode} disabled={loading} className="mt-4">
        {loading ? "Running..." : "Run Code"}
      </Button>

      {output && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong>Output:</strong>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
