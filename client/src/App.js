import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const textareaRef = useRef(null); // Create a ref for the textarea

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    autoResizeTextarea(); // Call auto resizing function on textarea change
  };

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:4000/api/predict/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({input}),
    });
    const data = await response.json();
    console.log(data)
    // const data = 0;
    if (data === 0) {
      setResult("Fake News");
    } else {
      setResult("Real News")
    }
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = ""; // Reset the height
      textarea.style.height = Math.min(textarea.scrollHeight-16, 100) + "px"; // Set the height
    }
  };

  return (
    <div className="App">
      <div className='container'>
        <h1>FactCheck<span style={{color: 'red'}}>AI</span></h1>
        <p>Enter the URL of a news article to see if it's real or fake! <br/>(Right now copy paste the whole news article)</p>
        <textarea 
          id="news_url" 
          ref={textareaRef} // Attach the ref to the textarea
          value={input}
          onChange={handleTextareaChange}
          rows={1}
        />
        <button id="submit_btn" onClick={handleSubmit}>Is It Real?</button>
        <p id="real_fake">{result}</p>
        </div>
    </div>
  );
}

export default App;
