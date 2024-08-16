import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Models from './Models';
import SVM from './SVM';
import NN from './NN';
import RF from './RF';
import NB from './NB';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="models" element={<Models />} />
            <Route path="SVM" element={<SVM />} />
            <Route path="NN" element={<NN />} />
            <Route path="RF" element={<RF />} />
            <Route path="NB" element={<NB />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;