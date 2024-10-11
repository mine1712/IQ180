import React, { useState } from 'react';
import './Singleplayer.css';

const Singleplayer = () => {
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [boxValues, setBoxValues] = useState(Array(7).fill(''));
  const [buttonStates, setButtonStates] = useState(generateButtonStates());
  const [buttonValues, setButtonValues] = useState(generateButtonValues());
  const [randomNumber, setRandomNumber] = useState(0);

  function generateButtonValues() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10) + 1);
  }

  function generateButtonStates() {
    return Array(6).fill(true); // Initialize all buttons as enabled
  }

  function generateRandomNumber() {
    const operations = ['+', '-', '*', '/'];
    let result;
    let validCombinationFound = false;

    while (!validCombinationFound) {
      const selectedNumbers = [];
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * buttonValues.length);
        selectedNumbers.push(buttonValues[randomIndex]);
      }

      const selectedOperations = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * operations.length);
        selectedOperations.push(operations[randomIndex]);
      }

      // Create the expression with 4 numbers and 3 operations
      const expression = `${selectedNumbers[0]} ${selectedOperations[0]} ${selectedNumbers[1]} ${selectedOperations[1]} ${selectedNumbers[2]} ${selectedOperations[2]} ${selectedNumbers[3]}`;

      try {
        result = eval(expression); // Evaluate the expression
        if (Number.isInteger(result) && result >= 0) { // Check if it is a positive integer
          validCombinationFound = true; // Exit the loop if we find a positive integer
        }
      } catch (error) {
        // Ignore errors and continue searching for a valid combination
      }
    }

    return result; // Return the found positive integer
  }

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (playerName) {
      setIsNameSubmitted(true);
      setRandomNumber(generateRandomNumber());
    }
  };

  const handleButtonClick = (index) => {
    const firstEmptyIndex = boxValues.indexOf('');
    if (firstEmptyIndex !== -1) {
      const newButtonStates = [...buttonStates];
      newButtonStates[index] = false; // Disable the button when clicked

      const newBoxValues = [...boxValues];
      const valueToAdd = buttonValues[index]; // Get the corresponding value of the button

      newBoxValues[firstEmptyIndex] = valueToAdd; // Add the value to the first empty box
      setBoxValues(newBoxValues);
      setButtonStates(newButtonStates);
    }
  };

  const handleOperationClick = (operation) => {
    const newBoxValues = [...boxValues];
    const firstEmptyIndex = newBoxValues.indexOf('');

    if (firstEmptyIndex !== -1) {
      newBoxValues[firstEmptyIndex] = operation; // Add the symbol to the first empty box
      setBoxValues(newBoxValues);
    }
  };

  const handleClear = () => {
    setBoxValues(Array(7).fill('')); // Clear the boxes
    setButtonStates(generateButtonStates()); // Enable all buttons
    setButtonValues(buttonValues); // Keep the same button values
    setRandomNumber(randomNumber); // Keep the same random number
  };

  const handleCheckSolution = () => {
    const expression = boxValues.filter(value => value !== '').join(' ');
    try {
      const result = eval(expression.replace('x', '*'));
      if (result === randomNumber) {
        alert("Correct! The solution is valid.");
      } else {
        alert(`Incorrect. The result is ${result}, but ${randomNumber} was expected.`);
      }
    } catch (error) {
      alert("Error in the expression. Please ensure it is well-formed.");
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
        <div className="game-screen">
          <h2>Welcome {playerName}! Let's start!</h2> {/* Welcome message */}
          <div className="top-buttons">
            {buttonStates.map((isVisible, index) => (
              isVisible && (
                <button key={index} onClick={() => handleButtonClick(index)}>
                  {buttonValues[index]}
                </button>
              )
            ))}
          </div>

          <div className="boxes">
            {boxValues.map((value, index) => (
              <div key={index} className="box">
                {value}
              </div>
            ))}
            <div className="box equals-box">=</div>
            <div className="box random-number-box">{randomNumber}</div>
          </div>

          <div className="bottom-buttons">
            <div className="operations-buttons">
              <button onClick={() => handleOperationClick('+')}>+</button>
              <button onClick={() => handleOperationClick('-')}>-</button>
              <button onClick={() => handleOperationClick('/')}>/</button>
              <button onClick={() => handleOperationClick('*')}>x</button>
            </div>
            <button className="clear-button" onClick={handleClear}>Clear</button>
            <button className="check-button" onClick={handleCheckSolution}>Check Solution</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Singleplayer;
