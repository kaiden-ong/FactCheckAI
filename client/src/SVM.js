import React from 'react';
import './SVM.css';
import { NavLink } from 'react-router-dom';

function SVM() {
    return (
        <div className="container">
          {/* Sidebar */}
            <aside className="sidebar">
                <h2>Dashboard</h2>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/models" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Introduction
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/SVM" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Support Vector Machines
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/NB" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Naive Bayes
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/RF" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Random Forests
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/NN" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Neural Network
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
    
          {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header>
                    <h1>Support Vector Machine Statistics</h1>
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

export default SVM;
