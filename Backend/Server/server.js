const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 10000;
const GEMINI_API_KEY = "your-gemini-api-key-here"; // 🔁 Replace with your actual API key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// ✅ Route 1: Run Code
app.post("/api/code/run", (req, res) => {
  const { code } = req.body;

  const filename = "temp_code.py"; // assuming Python for now
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, code);

  exec(`python ${filepath}`, (err, stdout, stderr) => {
    if (err || stderr) {
      return res.json({ error: stderr || err.message });
    }
    res.json({ output: stdout });
  });
});

// ✅ Route 2: Get Feedback from Gemini
app.post("/api/code/feedback", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "⚠️ No code provided." });
  }

  const prompt = `You are a helpful AI assistant. Please analyze the following code:\n\n${code}\n\nGive feedback on:\n- Time and space complexity\n- Code quality\n- Optimization suggestions`;

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const feedback = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No feedback returned.";
    res.json({ feedback });

  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "❌ Failed to get feedback." });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
