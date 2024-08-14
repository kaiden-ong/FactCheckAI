import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Statistics from './Statistics';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="models" element={<Statistics />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;