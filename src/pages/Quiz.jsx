import React, { useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [questionData, setQuestionData] = useState(null);

  const generateQuestion = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }
    try {
      console.log("Sending topic:", topic);
      const res = await axios.post('http://localhost:5000/api/generate', {
        topic: topic,
      });
      setQuestionData(res.data.question);
    } catch (err) {
      console.error('❌ Error:', err);
      alert("Failed to generate question");
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h2>Quiz Generator</h2>
      <div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., js)"
        />
        <button onClick={generateQuestion}>Generate Question</button>
      </div>

      {questionData && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{questionData.question}</h3>
          <ul>
            {questionData.options.map((opt, index) => (
              <li key={index}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;
