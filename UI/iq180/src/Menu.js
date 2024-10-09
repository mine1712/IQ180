import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const RandomLetter = () => {
  const [letters, setLetters] = useState([]);

  const getColorForSymbol = (symbol) => {
    switch (symbol) {
      case '+':
        return '#ff8e86'; // Color para '+'
      case '-':
        return '#c586ff'; // Color para '-'
      case '/':
        return '#86f6ff'; // Color para '/'
      case 'x':
        return '#ff86fd'; // Color para 'x'
      case '%':
        return '#f5ff86'; // Color para '%'
    }
  };

  const generateRandomLetter = () => {
    const lettersArray = '+-/%x';
    const randomIndex = Math.floor(Math.random() * lettersArray.length);
    const symbol = lettersArray[randomIndex]; // Guardar el símbolo
    const newLetter = {
      char: symbol,
      left: Math.random() * window.innerWidth, // Posición horizontal aleatoria
      top: -40, // Empieza desde la parte superior
      color: getColorForSymbol(symbol), // Usar el símbolo para el color
    };
    setLetters((prevLetters) => [...prevLetters, newLetter]);
  };

  useEffect(() => {
    // Generar una letra al inicio
    const interval = setInterval(() => {
      generateRandomLetter();
    }, 200); // Cambiar letras cada 200 ms

    return () => clearInterval(interval);
  }, []);

  // Animar las letras
  useEffect(() => {
    const fallInterval = setInterval(() => {
      setLetters((prevLetters) => 
        prevLetters.map(letter => ({
          ...letter,
          top: letter.top + 5, // Caer 5px cada intervalo
        })).filter(letter => letter.top < window.innerHeight) // Eliminar letras que salieron de la pantalla
      );
    }, 50); // Actualizar la posición cada 50 ms

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
            fontSize: '36px', // Aumentar el tamaño de la fuente
            color: letter.color, // Usar el color específico para cada letra
            textShadow: '1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black', // Borde negro
          }}
        >
          {letter.char}
        </div>
      ))}
    </div>
  );
};

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
      <RandomLetter />
    </div>
  );
}

export default Menu;
