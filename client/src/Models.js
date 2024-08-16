import React from 'react';
import './Models.css';
import { Link } from 'react-router-dom';

function Models() {
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
              <h1>Model Analysis Overview</h1>
            </header>
    
            <section className="intro-section">
              <h2>Project Overview</h2>
              <p>
                This project involves developing and analyzing various machine learning models to solve complex problems.
                Each model has been trained and evaluated using diverse datasets to ensure high accuracy and reliability.
              </p>
            </section>
    
            <section className="intro-section">
              <h2>Model Development</h2>
              <p>
                The models were developed using state-of-the-art techniques, with careful consideration given to hyperparameter tuning
                and feature selection. Each model underwent rigorous testing to ensure it performs well under different conditions.
              </p>
            </section>
    
            <section className="intro-section">
              <h2>Evaluation Metrics</h2>
              <p>
                To assess the effectiveness of each model, we used various evaluation metrics such as accuracy, precision, recall, and F1-score.
                These metrics provide a comprehensive understanding of how each model performs across different tasks.
              </p>
            </section>
    
            <section className="intro-section">
              <h2>Future Improvements</h2>
              <p>
                While the models have shown promising results, there is always room for improvement. Future work will focus on refining
                the models further and exploring additional datasets to enhance their performance even more.
              </p>
            </section>
    
            <footer className="intro-footer">
              <p>&copy; 2024 Your Name. All rights reserved.</p>
            </footer>
          </div>
        </div>
    );
}

export default Models;
