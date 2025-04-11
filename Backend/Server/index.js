// Load required libraries
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Enable CORS and Body Parser
app.use(cors());
app.use(bodyParser.json());

// ✅ Load Environment Variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

// ✅ Route 1: Generate Roadmap
app.post("/generate-roadmap", async (req, res) => {
    const { userGoal, timeAvailable, skillLevel, isBeginner } = req.body;

    if (!userGoal || !timeAvailable || !skillLevel || typeof isBeginner === "undefined") {
        return res.status(400).json({ error: "⚠️ Missing one or more required fields." });
    }

    const prompt = `
You are an AI career and learning roadmap generator.

The user will give you:
- Their career goal
- Time they can dedicate weekly (in hours)
- Their current skill level (beginner, intermediate, advanced)
- Whether they’re completely new to this field or have some experience

Based on these inputs, generate a personalized and structured learning roadmap.

Structure:
- Divide the roadmap into stages: Beginner, Intermediate, Advanced
- Each stage should include:
  - Topics to learn
  - Recommended tools/technologies
  - Mini projects or hands-on tasks
  - Approximate time to spend based on user availability
- Keep advice practical and step-by-step
- Format in bullet points or markdown for easy rendering

User Details:
- Goal: ${userGoal}
- Time Available Weekly: ${timeAvailable} hours
- Skill Level: ${skillLevel}
- Beginner: ${isBeginner ? "Yes" : "No"}
`;

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const roadmap = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No roadmap generated.";
        res.json({ advice: roadmap });

    } catch (error) {
        console.error("Error generating roadmap:", error.message);
        res.status(500).json({ error: "❌ Failed to generate roadmap." });
    }
});

// ✅ Route 2: Run code using Judge0
app.post("/api/code/run", async (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "⚠️ Code is required." });

    try {
        const response = await axios.post(JUDGE0_URL, {
            source_code: code,
            language_id: 54, // 54 = C++ (You can change to 63 for JavaScript, etc.)
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPID_API_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
            }
        });

        res.json({ output: response.data.stdout || response.data.stderr || "⚠️ No output." });

    } catch (error) {
        console.error("Judge0 Error:", error.message);
        res.status(500).json({ error: "❌ Code execution failed." });
    }
});

// ✅ Route 3: Get AI Feedback on Code
app.post("/api/code/feedback", async (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "⚠️ Code is required for feedback." });

    const prompt = `Please analyze the following code and:
- Explain its logic
- Identify time and space complexity
- Suggest any improvements if possible

Code:
\`\`\`
${code}
\`\`\`
`;

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const feedback = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No feedback generated.";
        res.json({ feedback });

    } catch (error) {
        console.error("Gemini Feedback Error:", error.message);
        res.status(500).json({ error: "❌ Failed to get code feedback." });
    }
});

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("🚀 Backend Server is Live with Roadmap, Code Runner & AI Feedback!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🌐 Server is running on http://localhost:${PORT}`);
});
