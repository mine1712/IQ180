import React, { useState, useEffect } from 'react';
import '../css/Singleplayer.css';
import {GameArea} from '../components';
import { generateNumbers } from '../utils/numberGenerator'

const Singleplayer = ({goToPage}) => {
    const [currentSingleplayerScreen, setCurrentSingleplayerScreen] = useState("nameentry");
    const [playerScore, setPlayerScore] = useState(0);
    const [playSlotNumbers,setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators,setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers,setBankNumbers] = useState([]);
    const [bankOperators,setBankOperators] = useState(['+','-','x','÷'])
    // const [selectedRoom, setSelectedRoom] = useState(null);
    const [userName, setUserName] = useState("");
    const [timeLeft,setTimeLeft] = useState(null);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [isTimeUp,setIsTimeUp] = useState(false);
    const [targetResult,setTargetResult] = useState(null);
    const [isRoundInProgress,setIsRoundInProgress] = useState(false);
    const [playerLost,setPlayerLost] = useState(false);
    const [numbersLengthInput, setNumbersLengthInput] = useState("5");
    const [numbersLength, setNumbersLength] = useState(5);
    const [orderOfOperations, setOrderOfOperations] = useState("pemdas");
    const [roundLengthInput, setRoundLengthInput] = useState("60")
    const [roundLength, setRoundLength] = useState(60);
    // const [getNumberButtonState,setGetNumberButtonState] = useState(false);
    // const [privateRoomCode,setPrivateRoomCode] = useState(null);

    const initializeSingleplayer = () => {
        setPlayerScore(0);
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength-1).fill());
        setBankNumbers([]);
        setTimeLeft(null);
        setIsYourTurn(false);
        setIsTimeUp(false);
        setTargetResult(null);
        setIsRoundInProgress(false);
        setPlayerLost(false);
    }

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
    }

    const handleOptionsSubmit = () => {
        let errors = [];
        if (!checkNumbersLength(numbersLengthInput)) {
            errors.push("Numbers must be an integer from 3-9");
        }
        if (!checkRoundLength(roundLengthInput)) {
            errors.push("Round length must be integer from 20-120");
        }
        if (errors.length !== 0) {
            alert(errors.join("\n"));
            return;
        }
        setNumbersLength(parseInt(numbersLengthInput));
        setRoundLength(parseInt(roundLengthInput));
        setCurrentSingleplayerScreen("gamescreen");
        // alert(checkNumbersLength(numbersLength));
    }

    useEffect(() => {
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength-1).fill());
    }, [numbersLength])

    function checkNumbersLength(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 3 && n<=9;
    }
    
    function checkRoundLength(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 20 && n<=120;
    }

    const handleSubmission = (numbers,operators) => {
        if (orderOfOperations=="pemdas") {
            let equation = "";
            let playerAnswer;
            for (let i=0;i<numbers.length;i++) {
                equation+=numbers[i];
                if (i!==numbers.length-1) {
                    equation+=operators[i];
                }
            }
            // alert(equation)
            try {
                playerAnswer = eval(equation);
                if (playerAnswer === targetResult) {
                    alert("Correct! The solution is valid.");
                    setIsRoundInProgress(false);
                    setIsYourTurn(false)
                    setPlayerScore(playerScore+1);
                    return true;
                } else {
                    alert(`Incorrect. The result is ${playerAnswer}, but ${targetResult} was expected.`);
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
        } else if (orderOfOperations=="lefttoright") {
            let nums_check = numbers.filter((value) => value !== null);
            let operators_check = operators.filter((value) => value !== null);
            // let booleanResult;
            if (nums_check.length === numbersLength && operators_check.length === (numbersLength-1)) {
                let result = numbers[0];
                for (let i=1;i<numbers.length;i++) {
                    switch (operators[i-1]) {
                        case '+':
                            result += numbers[i];
                            break;
                        case '-':
                            result -= numbers[i];
                            break;
                        case '*':
                            result *= numbers[i];
                            break;
                        case '/':
                            result /= numbers[i];
                            break;
                    }
                }
                if (result === targetResult) {
                    alert("Correct! The solution is valid.");
                    setIsRoundInProgress(false);
                    setIsYourTurn(false)
                    setPlayerScore(playerScore+1);
                    return true;
                } else {
                    alert(`Incorrect. The result is ${result}, but ${targetResult} was expected.`);
                    setTimeLeft(0);
                    setPlayerLost(true);
                    return false;
                }
            }
            alert("Error in the expression. Please ensure it is well-formed.");
            return false;
        }
        
    }

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
            {currentSingleplayerScreen=="nameentry" && (
                <div className="modal">
                <div className="modal-content">
                    <h2>Enter Your Name</h2>
                    <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        placeholder="Your name" 
                        className='input'
                    />
                    <button onClick={handleNameSubmit}>Submit</button>
                </div>
                </div>
            )}
            {currentSingleplayerScreen=="gameoptions" && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Welcome {userName}!</h1>
                        <h2>Choose your options</h2>
                        <div>
                            <h3 style={{textAlign:'center', display:'inline'}}>Numbers: </h3>
                            <input 
                                type="text" 
                                value={numbersLengthInput} 
                                onChange={(e) => setNumbersLengthInput(e.target.value)} 
                                placeholder="Default = 5" 
                                className='input'
                            />
                        </div>
                        <div>
                            <h3 style={{textAlign:'center', display:'inline'}}>Order of Operation: </h3>
                            <select value={orderOfOperations}
                                onChange={(e) => setOrderOfOperations(e.target.value)}
                            >
                                <option value="pemdas">PEMDAS</option>
                                <option value="lefttoright">Left to Right</option>
                            </select>
                        </div>
                        <div>
                            <h3 style={{textAlign:'center', display:'inline'}}>Round length: </h3>
                            <input 
                                type="text" 
                                value={roundLengthInput} 
                                onChange={(e) => setRoundLengthInput(e.target.value)} 
                                placeholder="Default = 60" 
                                className='input'
                            />
                        </div>
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
                        <button onClick={handleOptionsSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {currentSingleplayerScreen=="gamescreen" && (
                <div>
                    {/* <h1 style={{textAlign:'center'}}>Welcome {userName}</h1> */}
                    <h1>Your score = {playerScore}</h1>
                    {targetResult!==null && (
                        <h1>Target = {targetResult}</h1>
                    )}
                    {timeLeft!==null && (
                        <p>Time remaining = {timeLeft}</p>
                    )}
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
                    <div style={{textAlign:'center'}}>
                        <button onClick={() => {
                                setIsYourTurn(true);
                                setTimeLeft(roundLength);
                                const generated = generateNumbers(numbersLength);
                                setBankNumbers(generated[0]);
                                setTargetResult(generated[1]);
                                setPlaySlotNumbers(Array(numbersLength).fill());
                                setPlaySlotOperators(Array(numbersLength-1).fill());
                                setIsRoundInProgress(!isRoundInProgress);
                                }
                            }
                            disabled = {isRoundInProgress}
                            
                        >Start</button>
                    </div>
                    
                    
                    <GameArea playSlotNumbers={playSlotNumbers}
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
                    {playerLost && (
                        <h1 style={{textAlign:'center'}}>You lost! Try again?</h1>
                    )}
                    <div style={{textAlign:'center'}}>
                        {playerLost && (
                            <button onClick={initializeSingleplayer}>Restart Game</button>
                        )}
                        <button onClick={()=>goToPage("Menu")}>Return to Menu</button>
                    </div>
                    
                </div>
            )}
        </div>     
    )
    }

export default Singleplayer;