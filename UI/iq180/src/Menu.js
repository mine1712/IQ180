// Menu.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Howtoplay from './Howtoplay';
import './App.css';

const RandomLetter = () => {
  const [letters, setLetters] = useState([]);

  const getColorForSymbol = (symbol) => {
    switch (symbol) {
      case '+':  
        return '#ff8e86';
      case '-':
        return '#6cf94c';
      case '÷':
        return '#86f6ff';
      case 'x':
        return '#ff86fd';
      case '%':
        return '#f5ff86';
      default:
        return '#ffffff';
    }
  };

  const generateRandomLetter = () => {
    const lettersArray = '+-÷%x';
    const randomIndex = Math.floor(Math.random() * lettersArray.length);
    const symbol = lettersArray[randomIndex];
    const newLetter = {
      char: symbol,
      left: Math.random() * window.innerWidth,
      top: -40,
      color: getColorForSymbol(symbol),
    };
    setLetters((prevLetters) => [...prevLetters, newLetter]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomLetter();
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fallInterval = setInterval(() => {
      setLetters((prevLetters) => 
        prevLetters.map(letter => ({
          ...letter,
          top: letter.top + 5,
        })).filter(letter => letter.top < window.innerHeight)
      );
    }, 40);

    return () => clearInterval(fallInterval);
  }, []);

  return (
    <div className="rain-container">
      {letters.map((letter, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: letter.left,
            top: letter.top,
            fontSize: '36px',
            color: letter.color,
            textShadow: '1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          {letter.char}
        </div>
      ))}
    </div>
  );
};

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
