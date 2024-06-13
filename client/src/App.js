import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    autoResizeTextarea();
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
    console.log(data);
    // const data = 0;
    if (data === 0) {
      setResult("Fake News");
    } else {
      setResult("Real News");
    }
    setIsPulsing(true);
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight-16, 100) + "px";
    }
  };

  useEffect(() => {
    if (isPulsing) {
      setTimeout(() => {
        setIsPulsing(false);
      }, 1000);
    }
  }, [isPulsing]);

  return (
    <div className="App">
      <div className='container'>
        <h1>FactCheck<span style={{color: 'red'}}>AI</span></h1>
        <p>Enter the URL of a news article to see if it's real or fake! <br/>(Right now copy paste the whole news article)</p>
        <textarea 
          id="news_url" 
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          rows={1}
        />
        <button id="submit_btn" class="submit-btn-pushable" role="button" onClick={handleSubmit}>
          <span class="submit-btn-shadow"></span>
          <span class="submit-btn-edge"></span>
          <span class="submit-btn-front text">
            Is It Real?
          </span>
        </button>
        {/* <button id="submit_btn" onClick={handleSubmit}>Is It Real?</button> */}
        <p id="real_fake" className={`${isPulsing ? 'pulse' : ''}`}>{result}</p>
        </div>
    </div>
  );
}

export default App;
