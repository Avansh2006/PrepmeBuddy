// === BACKEND: server.js ===
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Required to parse JSON from requests

app.post('/api/generate', (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim() === '') {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const question = {
    question: `What is a key concept in ${topic}?`,
    options: [
      `${topic} Concept A`,
      `${topic} Concept B`,
      `${topic} Concept C`,
      `${topic} Concept D`,
    ],
    answer: `${topic} Concept B`,
  };

  res.json({ question });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
