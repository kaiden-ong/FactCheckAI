import React, { useState, useRef } from 'react';
import './Home.css';
import Results from './Results';
import { Link } from 'react-router-dom';
import checkmark from './assets/checkmark.png';

function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const textareaRef = useRef(null);
  const [model, setModel] = useState('svm');

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    autoResizeTextarea();
  };

  // TODO: Make pressing enter same as handleSubmit
  const handleSubmit = async () => {
    let articleText = await parseHTML(input);
    if (articleText === "INVALID URL FORMAT" || articleText === "CANNOT PARSE FROM URL") {
      setError(articleText);
      setTimeout(() => setError(''), 3000);
    } else {
      setIsLoading(true);
      const response = await fetch(`/api/predict/classify?input=${articleText.substring(0,8000)}&model=${model}`);
      const data = await response.json();
      if (data.status === 500) {
        console.log("error")
      }
      const result = data.prediction;
      const probability = data.probabilities;
      const time = data.latency;
      const model_used = data.model
      console.log(data);
      // const data = 0;
      if (result === 0) {
        setResult({ "Result": "Fake News", "Probability": probability, "Time": time, "Model": model_used, "Input": articleText.substring(0,8000) });
      } else {
        setResult({ "Result": "Real News", "Probability": 1-probability, "Time": time, "Model": model_used, "Input": articleText.substring(0,8000) });
      }
      setShowCheck(true);
      await delay(2000);
      setShowResult(true);
    }
  };

  function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }

  async function parseHTML(URL) {
    // Function to validate URL
    function validURL(URL) {
        const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
        const regex = new RegExp(expression);
        return regex.test(URL);
    }

    
    if (validURL(URL)) {
      try {
        const response = await fetch("/api/parser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ URL: URL })
        });
        const data = await response.json();
        if (data.status === "success") {
            return data.isURL;
        } else {
            return "CANNOT PARSE FROM URL";
        }
      } catch (error) {
        console.error('Error posting data:', error);
        return "Error posting data";
      }
    } else {
        return "INVALID URL FORMAT";
    }
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
    setResult(null);
    setError('');
    setIsLoading(false);
    setShowCheck(false);
    setShowResult(false);
  }

  return (
    <div className="home">
      <div className={`${showResult === true ? 'result-container' : 'home-container'}`}>
        <h1>FactCheck<span style={{color: 'red'}}>AI</span></h1>
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
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
                    <img src={checkmark} alt="Checkmark"/>
                    <h3>The Results Are In!!!</h3>
                  </div>
                )}
              </div>
            ) : (
              <div className="home-content">
                <p>Enter the URL of a news article to see if it's real or fake! <br/></p>
                  {/* <br/>(Right now copy paste the whole news article)</p> */}
                <div className="model-options">
                  <button
                    className={`model-button ${model === 'svm' ? 'selected' : ''}`}
                    onClick={() => setModel('svm')}
                  >
                    SVM
                  </button>
                  <button
                    className={`model-button ${model === 'nb' ? 'selected' : ''}`}
                    onClick={() => setModel('nb')}
                  >
                    Naive Bayes
                  </button>
                  <button
                    className={`model-button ${model === 'rf' ? 'selected' : ''}`}
                    onClick={() => setModel('rf')}
                  >
                    Random Forest
                  </button>
                  <button
                    className={`model-button ${model === 'nn' ? 'selected' : ''}`}
                    onClick={() => setModel('nn')}
                  >
                    Neural Network
                  </button>
                </div>
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
                <div>
                  <Link to="/models" className="btn btn-primary">Learn More</Link>
                </div>
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

export default Home;
