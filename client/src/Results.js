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
                    ""
    const prediction = result.Result;
    let prob = result.Probability*100;
    prob = Math.round(prob * 1000) / 1000;
    let time = result.Time;
    time = Math.round(time * 1000) / 1000;

    return (
        <div>
            <h2>Our {model} thinks this article is <span style={{ textDecoration: 'underline' }}>{prediction}</span>!</h2>
            <div>
                <h3>Here's some cool statistics</h3>
                <p>Probability:  {prob}%</p>
                <p>Time Elapsed: {time} seconds</p>
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