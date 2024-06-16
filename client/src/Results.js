import React, { useState, useEffect } from 'react';
import './Results.css';
import JSConfetti from 'js-confetti'

function Results({ result, reset }) {
    const [isPulsing, setIsPulsing] = useState(false);

    const jsConfetti = new JSConfetti()
    if (result === "Real News") {
        jsConfetti.addConfetti()
    }

    useEffect(() => {
        if (isPulsing) {
        setTimeout(() => {
            setIsPulsing(false);
        }, 1000);
        }
    }, [isPulsing]);

    return (
        <div>
            <h2 id="real_fake" className={`${isPulsing ? 'pulse' : ''}`}>We're pretty sure that's <span style={{ textDecoration: 'underline' }}>{result}</span>!</h2>
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
