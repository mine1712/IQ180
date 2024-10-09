import React, { useState } from 'react';
import './Singleplayer.css';

const Singleplayer = () => {
  const [playerName, setPlayerName] = useState(''); 
  const [isNameSubmitted, setIsNameSubmitted] = useState(false); 
  const handleNameChange = (event) => {
    setPlayerName(event.target.value); 
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (playerName) {
      setIsNameSubmitted(true); 
    }
  };

  return (
    <div className="Singleplayer-container">
      {!isNameSubmitted ? (
        <form onSubmit={handleSubmit}>
          <h2>Set your name</h2>
          <input
            type="text"
            value={playerName}
            onChange={handleNameChange}
            placeholder="Your name"
            required 
          />
          <button type="submit">Play</button>
        </form>
      ) : (
        <div>
          <h2>Welcome, {playerName}!</h2>
          {/* Add comment*/}
        </div>
      )}
    </div>
  );
};

export default Singleplayer;
