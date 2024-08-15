import React from 'react';
import './NB.css';

function NB() {
    return (
        <div className="container">
          {/* Sidebar */}
          <aside className="sidebar">
            <h2>Dashboard</h2>
            <nav>
              <ul>
                <li><a href="#model1">Model 1</a></li>
                <li><a href="#model2">Model 2</a></li>
                <li><a href="#model3">Model 3</a></li>
              </ul>
            </nav>
          </aside>
    
          {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header>
                <h1>Naive Bayes Statistics</h1>
                </header>
        
                {/* Key Metrics Summary */}
                <section className="metrics-summary">
                <div className="metric-card">
                    <h3>Accuracy</h3>
                    <p>95%</p>
                </div>
                <div className="metric-card">
                    <h3>Precision</h3>
                    <p>93%</p>
                </div>
                <div className="metric-card">
                    <h3>Recall</h3>
                    <p>92%</p>
                </div>
                <div className="metric-card">
                    <h3>F1-Score</h3>
                    <p>94%</p>
                </div>
                </section>
        
                {/* Graphs */}
                <section className="graphs">
                <div className="graph">
                    <h3>Model Performance Over Time</h3>
                    {/* Placeholder for a line chart */}
                    <div className="chart-placeholder">Line Chart</div>
                </div>
                <div className="graph">
                    <h3>Metric Comparison</h3>
                    {/* Placeholder for a bar chart */}
                    <div className="chart-placeholder">Bar Chart</div>
                </div>
                <div className="graph">
                    <h3>Confusion Matrix</h3>
                    {/* Placeholder for a confusion matrix */}
                    <div className="chart-placeholder">Confusion Matrix</div>
                </div>
                </section>
            </main>
        </div>
    );    
}

export default NB;