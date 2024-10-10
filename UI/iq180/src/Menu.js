// Menu.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Howtoplay from './Howtoplay';
import RandomLetter from './Effects';
import './App.css';



  

function Menu() {
  const [showHowtoplay, setShowHowtoplay] = useState(false); 
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/Singleplayer');
  };

  const handleHowtoplayClick = () => {
    setShowHowtoplay(true);
  };

  const handleCloseHowtoplay = () => {
    setShowHowtoplay(false);
  };

  return (
    <div className="menu-container">
      <h1 className="game-title">IQ180</h1>
      <button className="multiplayer-button" onClick={handlePlayClick}>
        Multiplayer
      </button>
      <button className="singleplayer-button" onClick={handlePlayClick}>
        Singleplayer
      </button>
      <button className="howtoplay-button" onClick={handleHowtoplayClick}>
        How to play
      </button>
      {showHowtoplay && <Howtoplay onClose={handleCloseHowtoplay} />}
      <RandomLetter />
    </div>
  );
}

export default Menu;
