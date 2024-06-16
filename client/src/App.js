import React, { useState, useRef } from 'react';
import './App.css';
import Results from './Results';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    autoResizeTextarea();
  };

  const handleSubmit = async () => {
    if (input.length < 15) {
      setResult("Choose longer text segment");
      return;
    }

    let articleText = parseHTML({input});
    setIsLoading(true);
    if (articleText === "INVALID URL") {
      setResult(articleText);
    } else {
      const response = await fetch('http://localhost:4000/api/predict/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({input}), 
        // body: JSON.stringify(articleText) use this after parseHTML has been implemented
      });
      const data = await response.json();
      console.log(data);
      // const data = 0;
      if (data === 0) {
        setResult("Fake News");
      } else {
        setResult("Real News");
      }
    }
    setShowCheck(true);
    await delay(2000);
    setShowResult(true);
  };

  function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }

  function parseHTML(URL) {
    // TODO: Tony use beautiful soup to parse the news article text and return it.
    if (validURL(URL)) {
      return URL;
    } else {
      return "INVALID URL";
    }
  }

  function validURL(URL) {
    // TODO: Tony determine if URL is valid if yes return true, else return false;
    return true;
  }

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight-16, 100) + "px";
    }
  };

  function reset() {
    setInput('');
    setResult('');
    setIsLoading(false);
    setShowCheck(false);
    setShowResult(false);
  }



  return (
    <div className="App">
      <div className='container'>
        <h1>FactCheck<span style={{color: 'red'}}>AI</span></h1>
        { !showResult ? (
          <div>
            { isLoading ? (
              <div id="loading">
                { !showCheck && (
                  <div className="loadingSpinner">
                    <div className="spinner"></div>
                    <h3 id="loadingText">Analyzing Article...</h3>
                  </div>
                )}
                { showCheck && (
                  <div className="checkmark">
                    <img src="/../assets/checkmark.png" alt="Checkmark"/>
                    <h3>The Results Are In!!!</h3>
                  </div>
                )}
              </div>
            ) : (
              <div className="home-content">
                <p>Enter the URL of a news article to see if it's real or fake! <br/>(Right now copy paste the whole news article)</p>
                <textarea 
                  id="news_url" 
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  rows={1}
                />
                {/* Button #82 from: https://getcssscan.com/css-buttons-examples */}
                <button id="submit_btn" className="submit-btn-pushable" onClick={handleSubmit}>
                  <span className="submit-btn-shadow"></span>
                  <span className="submit-btn-edge"></span>
                  <span className="submit-btn-front text">
                    Is It Real?
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Results result={result} reset={reset} />
        )}
        </div>
    </div>
  );
}

export default App;
