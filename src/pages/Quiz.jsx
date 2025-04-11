import React, { useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewQuestion = async () => {
    setLoading(true);
    setError('');
    setQuestion(null);

    const prompt = `Give me a DSA multiple choice question in JSON format:
    {
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "correct option"
    }`;

    try {
      const response = await axios.post('/api/gemini', { prompt });
      setQuestion(response.data);
    } catch (err) {
      console.error('Error fetching question:', err);
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <h1>🧠 DSA Quiz App</h1>
      <button onClick={handleNewQuestion} disabled={loading}>
        {loading ? "Loading..." : "Generate New Question"}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {question && (
        <div className="question-card">
          <h3>{question.question}</h3>
          <ul>
            {question.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
          <p><strong>Answer:</strong> {question.answer}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
