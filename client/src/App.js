import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Models from './Models';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="models" element={<Models />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;