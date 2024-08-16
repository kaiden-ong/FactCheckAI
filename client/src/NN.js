import React from 'react';
import './NN.css';
import { Link } from 'react-router-dom';


function NN() {
    return (
        <div className="introduction-page-container">
            <nav className="side-nav">
                <ul>
                    <li><Link to="/models">Introduction</Link></li>
                    <li><Link to="/SVM">Support Vector Machines</Link></li>
                    <li><Link to="/NB">Naive Bayes</Link></li>
                    <li><Link to="/RF">Random Forests</Link></li>
                    <li><Link to="/NN">Neural Network</Link></li>
                </ul>
            </nav>
    
            <div className="main-content">
                <header className="intro-header">
                <h1>Neural Networks</h1>
                </header>    
                <footer className="intro-footer">
                <p>&copy; 2024 Your Name. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default NN;
