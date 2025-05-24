import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Home from './pages/Home/Home';
import Ranking from './pages/Ranking/Ranking';
import './styles/main.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
  );
}

export default App;