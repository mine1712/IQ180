import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menu';
import Singleplayer from './Singleplayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/Singleplayer" element={<Singleplayer />} />
      </Routes>
    </Router>
  );
}

export default App;
