import React, { useState, useEffect } from 'react';
import '../css/Singleplayer.css';
import {GameArea} from '../components';
import { generateNumbers } from '../utils/numberGenerator'

const Singleplayer = () => {
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
    // const [getNumberButtonState,setGetNumberButtonState] = useState(false);
    // const [privateRoomCode,setPrivateRoomCode] = useState(null);

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
            setIsTimeUp(true);
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
        setCurrentSingleplayerScreen("gamescreen");
    }
    
    const handleSubmission = (numbers,operators) => {
        let equation = "";
        var playerAnswer;
        for (let i=0;i<numbers.length;i++) {
            equation+=numbers[i];
            if (i!==numbers.length-1) {
                equation+=operators[i];
            }
        }
        try {
            playerAnswer = eval(equation);
            if (playerAnswer === targetResult) {
                alert("Correct! The solution is valid.");
                return true;
            } else {
                alert(`Incorrect. The result is ${playerAnswer}, but ${targetResult} was expected.`);
                return false;
            }
        } catch (error) {
            alert("Error in the expression. Please ensure it is well-formed.");
            return false;
        }
        // const playerAnswer = eval(equation);
        // alert("Player Answer: "+playerAnswer+"\nTarget: "+targetResult);
        // return 
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
            {currentSingleplayerScreen=="gamescreen" && (
                <div>
                    <h1>Your score = {playerScore}</h1>
                    <h1>Target = {targetResult}</h1>
                    <p>Time remaining = {timeLeft}</p>
                    <button onClick={() => {
                        setTimeLeft(60);
                    }}>Reset Timer</button>
                    <button onClick={() => {
                        setTimeLeft(5);
                    }}>Test button disable</button>
                    {/* <button onClick={() => {
                        server.emit('requestNumbers');
                        setGetNumberButtonState(true);
                    }} disabled={getNumberButtonState}>Get numbers</button> */}
                    <button onClick={() => {
                        setTimeLeft(60);
                        setBankNumbers([]);
                        setPlaySlotNumbers(Array(5).fill());
                        setPlaySlotOperators(Array(4).fill());
                        // setGetNumberButtonState(false);
                    }}>Reset Room</button>
                    <p>It is {isYourTurn ? "" : "not "}your turn</p>
                    <button onClick={() => {
                        setIsYourTurn(true);
                        setTimeLeft(60);
                        const generated = generateNumbers();
                        setBankNumbers(generated[0]);
                        setTargetResult(generated[1]);
                        setPlaySlotNumbers(Array(5).fill());
                        setPlaySlotOperators(Array(4).fill());
                    }}>Start</button>
                    <GameArea playSlotNumbers={playSlotNumbers}
                        playSlotOperators={playSlotOperators}
                        bankNumbers={bankNumbers}
                        bankOperators={bankOperators}
                        setPlaySlotNumbers={setPlaySlotNumbers}
                        setPlaySlotOperators={setPlaySlotOperators}
                        setBankNumbers={setBankNumbers}
                        isTimeUp={isTimeUp}
                        handleSubmission={handleSubmission}
                    />
                </div>
            )}
        </div>     
    )
    }

export default Singleplayer;