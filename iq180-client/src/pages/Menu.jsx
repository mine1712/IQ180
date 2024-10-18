// Menu.js
import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
import { Howtoplay } from "../components";
import RandomLetter from "../components/Effects";
import "../css/Menu.css";

function Menu({ goToPage }) {
  const [showHowtoplay, setShowHowtoplay] = useState(false);
  // const navigate = useNavigate();

  // const handlePlayClick = () => {
  //   navigate('/Singleplayer');
  // };

  const handleHowtoplayClick = () => {
    setShowHowtoplay(true);
  };

  const handleCloseHowtoplay = () => {
    setShowHowtoplay(false);
  };

  return (
    <div className="area">
      <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    <div className="menu-container">
      <div className="game-title">IQ180</div>
      <button
        className="multiplayer-button"
        onClick={() => goToPage("Multiplayer")}
      >
        Multiplayer
      </button>
      <button
        className="singleplayer-button"
        onClick={() => goToPage("Singleplayer")}
      >
        Singleplayer
      </button>
      <button className="howtoplay-button" onClick={handleHowtoplayClick}>
        How to play
      </button>
      {showHowtoplay && <Howtoplay onClose={handleCloseHowtoplay} />}
      {/* <RandomLetter /> */}
    </div>
    </div>
  );
}

export default Menu;
