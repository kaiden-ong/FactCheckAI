import React from 'react';
import './Results.css';
import JSConfetti from 'js-confetti'

function Results({ result, reset }) {
    const jsConfetti = new JSConfetti()
    if (result === "Real News") {
        jsConfetti.addConfetti()
    }

    const prediction = result.Result;
    const prob = result.Probability*100;
    const time = result.Time;

    return (
        <div>
            <h2>We're pretty sure that's <span style={{ textDecoration: 'underline' }}>{prediction}</span>!</h2>
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
