import React from 'react';
import './Models.css';
import { NavLink } from 'react-router-dom';

function Models() {
    return (
        <div className="page-container">
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

            <div className="content">
                <header className="content-header">
                    <h1>Model Analysis Overview</h1>
                </header>

                <section className="content-section">
                    <h2>Project Overview</h2>
                    <p>
                        This project involves developing and analyzing various machine learning models to solve complex problems.
                        Each model has been trained and evaluated using diverse datasets to ensure high accuracy and reliability.
                    </p>
                </section>

                <section className="content-section">
                    <h2>Model Development</h2>
                    <p>
                        The models were developed using state-of-the-art techniques, with careful consideration given to hyperparameter tuning
                        and feature selection. Each model underwent rigorous testing to ensure it performs well under different conditions.
                    </p>
                </section>

                <section className="content-section">
                    <h2>Evaluation Metrics</h2>
                    <p>
                        To assess the effectiveness of each model, we used various evaluation metrics such as accuracy, precision, recall, and F1-score.
                        These metrics provide a comprehensive understanding of how each model performs across different tasks.
                    </p>
                </section>

                <section className="content-section">
                    <h2>Future Improvements</h2>
                    <p>
                        While the models have shown promising results, there is always room for improvement. Future work will focus on refining
                        the models further and exploring additional datasets to enhance their performance even more.
                    </p>
                </section>

                <footer className="content-footer">
                    <p>&copy; 2024 Kaiden Ong. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default Models;
