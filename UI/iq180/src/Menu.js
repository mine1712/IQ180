import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Menu() {
  const navigate = useNavigate();

  // Función que se ejecuta al hacer clic en "Jugar"
  const handlePlayClick = () => {
    navigate('/game'); // Redirige a la ruta "/game"
  };

  return (
    <div className="menu-container">
      <h1 className="game-title">IQ180</h1>
      <button className="play-button" onClick={handlePlayClick}>
        Play
      </button>
    </div>
  );
}

export default Menu;
