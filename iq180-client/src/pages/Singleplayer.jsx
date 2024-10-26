import React, { useState, useEffect } from "react";
import "../css/Singleplayer.css";
import { GameArea } from "../components";
import { generateNumbers } from "../utils/numberGenerator";

const Singleplayer = ({ goToPage }) => {
  const [currentSingleplayerScreen, setCurrentSingleplayerScreen] =
    useState("nameentry");
  const [playerScore, setPlayerScore] = useState(0);
  const [playSlotNumbers, setPlaySlotNumbers] = useState(Array(5).fill());
  const [playSlotOperators, setPlaySlotOperators] = useState(Array(4).fill());
  const [bankNumbers, setBankNumbers] = useState([]);
  const [bankOperators, setBankOperators] = useState(["+", "-", "x", "÷"]);
  // const [selectedRoom, setSelectedRoom] = useState(null);
  const [userName, setUserName] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [targetResult, setTargetResult] = useState(null);
  const [isRoundInProgress, setIsRoundInProgress] = useState(false);
  const [playerLost, setPlayerLost] = useState(false);
  const [numbersLengthInput, setNumbersLengthInput] = useState("5");
  const [numbersLength, setNumbersLength] = useState(5);
  // const [getNumberButtonState,setGetNumberButtonState] = useState(false);
  // const [privateRoomCode,setPrivateRoomCode] = useState(null);

  const initializeSingleplayer = () => {
    setPlayerScore(0);
    setPlaySlotNumbers(Array(5).fill());
    setPlaySlotOperators(Array(4).fill());
    setBankNumbers([]);
    setTimeLeft(null);
    setIsYourTurn(false);
    setIsTimeUp(false);
    setTargetResult(null);
    setIsRoundInProgress(false);
    setPlayerLost(false);
  };

  // useEffect(() => {
  //     server.on('numbers', (data) => {
  //         setBankNumbers(data.numbers);
  //         setTargetResult(data.targetResult);
  //         });
  // }, []);

  useEffect(() => {
    if (timeLeft > 0 && isYourTurn) {
      setIsTimeUp(false);
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (isYourTurn) {
        setIsTimeUp(true);
        setPlayerLost(true);
      }
    }
  }, [timeLeft]);

  // const handleRoomSelection = (room) => {
  //     setSelectedRoom(room);
  // }

  // useEffect(() => {
  //     if (selectedRoom!=null) {
  //         server.emit('joinRoom', { room: selectedRoom, name: userName });
  //         setIsYourTurn(true);
  //         setTimeLeft(60);
  //         setCurrentMultiplayerScreen("gamescreen");
  //     }
  // }, [selectedRoom])

  const handleNameSubmit = () => {
    setCurrentSingleplayerScreen("gameoptions");
  };

  const handleOptionsSubmit = () => {
    if (!checkNumbersLength(numbersLengthInput)) {
      alert("Numbers must be an integer from 3-9");
      return;
    }
    setNumbersLength(parseInt(numbersLengthInput));
    setCurrentSingleplayerScreen("gamescreen");
    // alert(checkNumbersLength(numbersLength));
  };

  useEffect(() => {
    setPlaySlotNumbers(Array(numbersLength).fill());
    setPlaySlotOperators(Array(numbersLength - 1).fill());
  }, [numbersLength]);

  function checkNumbersLength(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 3 && n <= 9;
  }

  const handleSubmission = (numbers, operators) => {
    let equation = "";
    let playerAnswer;
    for (let i = 0; i < numbers.length; i++) {
      equation += numbers[i];
      if (i !== numbers.length - 1) {
        equation += operators[i];
      }
    }
    // alert(equation)
    try {
      playerAnswer = eval(equation);
      if (playerAnswer === targetResult) {
        alert("Correct! The solution is valid.");
        setIsRoundInProgress(false);
        setIsYourTurn(false);
        setPlayerScore(playerScore + 1);
        return true;
      } else {
        alert(
          `Incorrect. The result is ${playerAnswer}, but ${targetResult} was expected.`
        );
        setTimeLeft(0);
        setPlayerLost(true);
        return false;
      }
    } catch (error) {
      alert("Error in the expression. Please ensure it is well-formed.");
      return false;
    }
    // const playerAnswer = eval(equation);
    // alert("Player Answer: "+playerAnswer+"\nTarget: "+targetResult);
    // return
  };

  return (
    <div>
      {/* {currentSingleplayerScreen=="selectroom" && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Welcome {userName}!</h1>
                        <h2>Select a Room</h2>
                        <button onClick={() => handleRoomSelection('Room 1')}>Room 1</button>
                        <button onClick={() => handleRoomSelection('Room 2')}>Room 2</button>
                        <button onClick={() => handleRoomSelection('Room 3')}>Room 3</button>
                        <h2>or enter a Private Room Code</h2>
                        <input 
                            type="text" 
                            value={privateRoomCode} 
                            onChange={(e) => setPrivateRoomCode(e.target.value)} 
                            placeholder="Your Code" 
                            className='input'
                        />
                        <button onClick={() => handleRoomSelection(privateRoomCode)}>Submit</button>
                </div>
            </div>
            )} */}
      {(currentSingleplayerScreen === "nameentry" ||
        currentSingleplayerScreen == "gameoptions") && (
        <div className="area">
          <div className="container">
            {/* <img className="image-background" src={op}></img> */}
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
            {currentSingleplayerScreen == "nameentry" && (
              <div className="form-container">
                <div className="set-name-text">Enter Your Name</div>
                <div className="input-container">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="set-name-input"
                  />
                  <button
                    className="set-name-button"
                    onClick={handleNameSubmit}
                  >
                    Enter
                  </button>
                </div>
              </div>
            )}
            {currentSingleplayerScreen == "gameoptions" && (
              <div className="form-container">
                {/* <p className="set-Welcome-text"> Welcome {userName}! </p>
              <p className="set-Welcome-text"> Choose your options </p> */}
                <div className="welcome-container">
                  <div className="set-welcome-text">Welcome {userName}!</div>
                  <div className="set-welcome-text">Choose your options </div>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    value={numbersLengthInput}
                    onChange={(e) => setNumbersLengthInput(e.target.value)}
                    placeholder="Number to Play"
                    className="set-name-input"
                  />
                  {/* <div>
                            <h3 style={{textAlign:'center', display:'inline'}}>CSS Test: </h3>
                            <input 
                                type="text" 
                                value={numbersLengthInput} 
                                onChange={(e) => setNumbersLengthInput(e.target.value)} 
                                placeholder="Default = 5" 
                                className='input'
                            />
                        </div> */}
                  <button
                    className="set-name-button"
                    onClick={handleOptionsSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {currentSingleplayerScreen == "gamescreen" && (
        <div className="gamescreen-container">
          <div className="player-container">
            <span>Player1: {playerScore}</span>
          </div>
          <div className="time-container">
            <span>Time: {typeof timeLeft === "number" ? timeLeft : "-"}</span>
          </div>
          <div className="content-container">
            {/* <h1 style={{textAlign:'center'}}>Welcome {userName}</h1> */}
            <div className="target-container">
              <span>
                Target: {typeof targetResult === "number" ? targetResult : "-"}
              </span>
            </div>
            {/* <p>Test = {isRoundInProgress?"yes":"no"}</p> */}
            {/* <button onClick={() => {
                        setTimeLeft(60);
                    }}>Reset Timer</button>
                    <button onClick={() => {
                        setTimeLeft(5);
                    }}>Test button disable</button> */}
            {/* <button onClick={() => {
                        server.emit('requestNumbers');
                        setGetNumberButtonState(true);
                    }} disabled={getNumberButtonState}>Get numbers</button> */}
            {/* <button onClick={() => {
                        setTimeLeft(60);
                        setBankNumbers([]);
                        setPlaySlotNumbers(Array(5).fill());
                        setPlaySlotOperators(Array(4).fill());
                        // setGetNumberButtonState(false);
                    }}>Reset Room</button> */}
            {/* <p>It is {isYourTurn ? "" : "not "}your turn</p> */}
            <div style={{ textAlign: "center" }}>
              <button
                className="singleplayer-start-button"
                onClick={() => {
                  setIsYourTurn(true);
                  setTimeLeft(60);
                  const generated = generateNumbers(numbersLength);
                  setBankNumbers(generated[0]);
                  setTargetResult(generated[1]);
                  setPlaySlotNumbers(Array(numbersLength).fill());
                  setPlaySlotOperators(Array(numbersLength - 1).fill());
                  setIsRoundInProgress(!isRoundInProgress);
                }}
                disabled={isRoundInProgress}
              >
                Start
              </button>
            </div>
            <GameArea
              playSlotNumbers={playSlotNumbers}
              playSlotOperators={playSlotOperators}
              bankNumbers={bankNumbers}
              bankOperators={bankOperators}
              setPlaySlotNumbers={setPlaySlotNumbers}
              setPlaySlotOperators={setPlaySlotOperators}
              setBankNumbers={setBankNumbers}
              isTimeUp={isTimeUp}
              handleSubmission={handleSubmission}
              isYourTurn={isYourTurn}
            />
            {playerLost && <h1 style={{ color: "white" }}>!Time is Over!</h1>}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 30,
              }}
            >
              {playerLost && (
                <button
                  className="singleplayer-start-button"
                  onClick={initializeSingleplayer}
                >
                  Restart Game
                </button>
              )}
              <button
                className="singleplayer-start-button"
                onClick={() => goToPage("Menu")}
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Singleplayer;
