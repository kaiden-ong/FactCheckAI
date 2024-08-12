import React from 'react';
import './Results.css';
import JSConfetti from 'js-confetti'

function Results({ result, reset }) {
    const jsConfetti = new JSConfetti()
    if (result.Result === "Real News") {
        jsConfetti.addConfetti()
    }
    const model = result.Model === "svm" ? "Support Vector Classifier" : 
                    result.Model === "nb" ? "Multinomial Naive Bayes Classifier" :
                    result.Model === "rf" ? "Random Forest Classifier" :
                    result.Model === "nn" ? "Neural Network" :
                    ""
    const prediction = result.Result;
    let prob = result.Probability*100;
    prob = Math.round(prob * 1000) / 1000;
    let time = result.Time;
    time = Math.round(time * 1000) / 1000;
    const input = result.Input;

    return (
        <div>
            <h2>
                Our {model} thinks this article is 
                <span className="highlighted-text"> {prediction}</span>!
            </h2>
            <div>
                <p><strong>The model input (max 8000 characters):</strong></p>
                <div className="result-input-container-wrapper">
                    <div className="result-input-container">
                        <div className="result-input">
                            <p>{input}</p>
                        </div>
                    </div>
                </div>
                <div className="statistics">
                    <p>Probability: <span className="stat-value">{prob}%</span></p>
                    <p>Time Elapsed: <span className="stat-value">{time} seconds</span></p>
                </div>
            </div>
            <button id="submit_btn" className="try-another-btn-pushable" onClick={reset}>
                <span className="try-another-btn-shadow"></span>
                <span className="try-another-btn-edge"></span>
                <span className="try-another-btn-front text">
                    Try Another
                </span>
            </button>
        </div>
    );
}

export default Results;