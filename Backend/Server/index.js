// Load required libraries
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Enable CORS (Allow frontend requests)
app.use(cors());
app.use(bodyParser.json());

// Load Gemini API Key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// ✅ Function to Generate Roadmap Advice
async function generateRoadmap({ userGoal, timeAvailable, skillLevel, isBeginner }) {
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

        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No roadmap generated.";
    } catch (error) {
        console.error("Error generating roadmap:", error.message);
        return "❌ Error generating roadmap. Please try again.";
    }
}

// ✅ API Route for Roadmap Generation
app.post("/generate-roadmap", async (req, res) => {
    const { userGoal, timeAvailable, skillLevel, isBeginner } = req.body;

    if (!userGoal || !timeAvailable || !skillLevel || typeof isBeginner === "undefined") {
        return res.status(400).json({ error: "⚠️ Missing one or more required fields." });
    }

    const advice = await generateRoadmap({ userGoal, timeAvailable, skillLevel, isBeginner });
    res.json({ advice });
});

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Roadmap Generator Backend is running! 🚀");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
