import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:4000/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({input}),
    });
    const data = await response.json();
    if (data.result === 0) {
      setResult("Fake News");
    } else {
      setResult("Real News")
    }
  };

  return (
    <div className="App">
      <h1>FactCheckAI</h1>
      <input 
        id="news_url" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button id="submit_btn" onClick={handleSubmit}>Is It Real?</button>
      <p id="real_fake">{result}</p>
    </div>
  );
}

export default App;
