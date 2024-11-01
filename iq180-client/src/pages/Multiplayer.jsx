import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
// import '../css/Multiplayer-temp.css';
import {server} from '../socket'
import {GameArea} from '../components';

function Multiplayer ({goToPage}) {
    // Screen Value
    const [currentMultiplayerScreen, setCurrentMultiplayerScreen] = useState("nameentry");
    // Player Info
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOponentScore] = useState(0);
    const [userName, setUserName] = useState("");
    const [playerID, setPlayerID] = useState(null);
    // Game Field Values
    const [playSlotNumbers,setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators,setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers,setBankNumbers] = useState([]);
    const [bankOperators,setBankOperators] = useState(['+','-','x','÷'])
    // Room variables
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [privateRoomCode,setPrivateRoomCode] = useState("");
    const [isReady, setIsReady] = useState(false);
    // Game Variables
    const [timeLeft,setTimeLeft] = useState(null);
    const [isTimeUp,setIsTimeUp] = useState(false);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [isRoundInProgress,setIsRoundInProgress] = useState(false);
    const [targetResult,setTargetResult] = useState(null);
    const [attemptsLeft, setAttemptsLeft] = useState(null);
    // const [getNumberButtonState,setGetNumberButtonState] = useState(false);
    // TODO: Configurable values
    const [roundLength, setRoundLength] = useState(60);
    const [roundLengthInput, setRoundLengthInput] = useState("60");
    const [numbersLength, setNumbersLength] = useState(5);
    const [numbersLengthInput, setNumbersLengthInput] = useState("5");
    const [orderOfOperations, setOrderOfOperations] = useState("pemdas");
    const [attemptsAllowed, setAttemptsAllowed] = useState(3);
    const [attemptsAllowedInput, setAttemptsAllowedInput] = useState("3");

    const [isConnected, setIsConnected] = useState(server.connected);

    useEffect(() => {
        function onNumbers(data) {
            setBankNumbers(data.numbers);
            setTargetResult(data.targetResult);
        }
        function onError({message}) {
            alert("Error: "+message);
        }
        server.on('numbers', onNumbers);
        server.on("error", onError);

        return () => {
            server.off('numbers', onNumbers);
            server.off("error", onError);
        }
    }, []);

    useEffect(() => {
        if (server.id !== undefined) {
            setPlayerID(server.id);
            // alert(server.id);
        }
    }, [server.id])

    useEffect(() => {
        function onUpdateScore(scores) {
            setPlayerScore(scores[playerID]);
            setOponentScore(Object.keys(scores).filter(key => key !== playerID).map(key => scores[key])[0]);
            setPlaySlotNumbers(Array(numbersLength).fill());
            setPlaySlotOperators(Array(numbersLength-1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            setAttemptsLeft(null);
            alert("The next round is beginning");
        }
        function onSwapTurn(nextPlayer) {
            // alert(nextPlayer)
            setIsRoundInProgress(false);
            if (nextPlayer==playerID) {
                setIsYourTurn(true);
            } else {
                setIsYourTurn(false);
            }
        }
        server.on('updateScore', onUpdateScore);
        server.on('swapTurn', onSwapTurn);

        return () => {
            server.off('updateScore', onUpdateScore);
            server.off('swapTurn', onSwapTurn);
        }
    }, [numbersLength,playerID]);
    
    useEffect(() => {
        function onGetReady() {
            setCurrentMultiplayerScreen("roomready");
        }
        server.on("getReady",onGetReady);

        return () => {
            server.off("getReady",onGetReady);
        }
    })

    useEffect(() => {
        function onStartGame({turn, targetLength, attempt, orderofoperations, roundLength}) {
            setNumbersLength(targetLength);
            setAttemptsAllowed(attempt);
            setOrderOfOperations(orderofoperations);
            setRoundLength(roundLength);
            if (turn==playerID) {
                setIsYourTurn(true);
                // setTimeLeft(60);
                setCurrentMultiplayerScreen("gamescreen");
            }
            setCurrentMultiplayerScreen("gamescreen");
        }

        server.on("startGame", onStartGame);

        return () => {
            server.off("startGame", onStartGame);
        }
    }, [playerID])

    useEffect(() => {
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength-1).fill());
    }, [numbersLength])

    useEffect(() => {
        function onRoomFull(){
            setSelectedRoom(null);
            alert("This room is full! Please select anothoer room");
        }
        function onJoinRoomSuccess() {
            // alert('success '+ selectedRoom);
            setCurrentRoom(selectedRoom);
            setSelectedRoom(null);
            setCurrentMultiplayerScreen("roomwaiting");
        }

        server.on('roomFull', onRoomFull);
        if (selectedRoom!=null) {
            server.on('joinRoomSuccess', onJoinRoomSuccess);
        }

        return () => {
            server.off('roomFull', onRoomFull);
            server.off('joinRoomSuccess', onJoinRoomSuccess);
        }
    }, [selectedRoom])

    const checkSocketConnection = () => {
        if (!server.connected) {
            console.log('Socket is disconnected');
            // Handle the disconnection logic here
        } else {
            console.log('Socket is connected');
        }
    };

    useEffect(() => {
        function onUserDisconnected(name) {
            if (currentMultiplayerScreen=="gamescreen") {
                alert("Your opponent \""+name+"\" has left the room.\nPlease return to the menu.");
                setIsRoundInProgress(false);
                setIsYourTurn(false);
            }
        }

        server.on("userDisconnected",onUserDisconnected);

        // Check connection status on mount
        // setIsConnected(server.connected);

        // Listen for connection and disconnection events
        // server.on('connect', () => setIsConnected(true));
        // server.on('disconnect', () => setIsConnected(false));

        return () => {
            server.off("userDisconnected",onUserDisconnected);
            // server.off('connect');
            // server.off('disconnect');
        }
    }, [currentMultiplayerScreen])

    useEffect(() => {
        if (timeLeft > 0 && isRoundInProgress) {
            setIsTimeUp(false);
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft===0 && isRoundInProgress){
            setIsTimeUp(true);
        }
    }, [timeLeft,isRoundInProgress]);

    useEffect(() => {
        if (isTimeUp && isRoundInProgress) {
            setIsRoundInProgress(false);
            server.emit('checkAns', {nums: Array(numbersLength).fill(), operators: Array(numbersLength-1).fill(), timeUsed: roundLength-timeLeft, room:currentRoom, attemptleft:0,isTimeUp: true});
        }
    },[isTimeUp,isRoundInProgress]);

    const handleRoomSelection = (room) => {
        setSelectedRoom(room);
    }

    useEffect(() => {
        if (selectedRoom!=null) {
            server.emit('joinRoom', { room: selectedRoom, name: userName });
            // alert(selectedRoom);
        }
    }, [selectedRoom])

    // useEffect(() => {
    //     // alert(currentRoom);
        // if (currentRoom!=null) {
        //     setIsYourTurn(true);
        //     setTimeLeft(60);
        //     setCurrentMultiplayerScreen("gamescreen");
        // }
    // }, [currentRoom])

    const handleNameSubmit = () => {
        setCurrentMultiplayerScreen("selectroom");
    }

    const handleSubmission = (numbers,operators) => {
        // alert(timeLeft);
        // alert("Multiplayer submission has not been implemented yet.\nNumbers: " + playSlotNumbers + "\nOperators: "+ playSlotOperators)
        server.emit('checkAns', {nums: numbers, operators: operators, timeUsed: roundLength-timeLeft, room:currentRoom, attemptleft:attemptsLeft, isTimeUp: isTimeUp});
        // setAttemptsLeft(attemptsLeft-1);
    }

    useEffect(() => {
        function onWrongAnswer(attemptleft) {
            // if (attemptleft===0) {
            //     setIsRoundInProgress(false);
            // }
            setAttemptsLeft(attemptleft);
            alert("Your answer was incorrect!");
        }
        server.on("wrongAnswer",onWrongAnswer);

        return () => {
            server.off("wrongAnswer",onWrongAnswer);
        }
    })

    const handleEnterOptions = () => {
        // alert("test1")
        server.emit("getOption");
        // alert("test")
        setCurrentMultiplayerScreen("roomoptions");
    }

    useEffect(() => {
        function onOptions({targetLength, attempt, orderofoperations, roundLength}) {
            setNumbersLengthInput(Integer.toString(targetLength));
            setAttemptsAllowedInput(Integer.toString(attempt));
            setOrderOfOperations(orderofoperations);
            setRoundLengthInput(Integer.toString(roundLength));
        }
        server.on("options",onOptions);

        return () => {
            server.off("options",onOptions);
        }
    }, [])

    function checkNumbersLength(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 3 && n<=9;
    }
    
    function checkRoundLength(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 20 && n<=120;
    }

    function checkAttemptsAllowed(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 1 && n<=5;
    }

    const handleOptionsSubmit = () => {
        let errors = [];
        if (!checkNumbersLength(numbersLengthInput)) {
            errors.push("Numbers must be an integer from 3-9");
        }
        if (!checkRoundLength(roundLengthInput)) {
            errors.push("Round Length must be integer from 20-120");
        }
        if (!checkAttemptsAllowed(attemptsAllowedInput)) {
            errors.push("Attempts Allowed must be integer from 1-5");
        }
        if (errors.length !== 0) {
            alert(errors.join("\n"));
            return;
        }
        setNumbersLength(parseInt(numbersLengthInput));
        setRoundLength(parseInt(roundLengthInput));
        setAttemptsAllowed(parseInt(attemptsAllowedInput));
        server.emit("setOptions",{targetLength:parseInt(numbersLengthInput), attempt:parseInt(attemptsAllowedInput), orderofoperations:orderOfOperations, roundLength:parseInt(roundLengthInput)});
        setCurrentMultiplayerScreen("roomready");
        // alert(checkNumbersLength(numbersLength));
    }

    const handleReady = () => {
        server.emit("playerReady");
        setIsReady(true);
    }

    useEffect(() => {
        function onResetRoom({turn, targetLength, attempt, orderofoperations}) {
            setNumbersLength(targetLength);
            setAttemptsAllowed(attempt);
            setOrderOfOperations(orderofoperations);
            setIsRoundInProgress(false);
            setPlayerScore(0);
            setPlaySlotNumbers(Array(targetLength).fill());
            setPlaySlotOperators(Array(targetLength-1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            setAttemptsLeft(null);
            if (turn==playerID) {
                setIsYourTurn(true);
                // setTimeLeft(60);
                // setCurrentMultiplayerScreen("gamescreen");
            } else {
                setIsYourTurn(false);
            }
            // setCurrentMultiplayerScreen("gamescreen");
        }

        server.on("resetRoom",onResetRoom);

        return () => {
            server.off("resetRoom",onResetRoom);
        }
    }, [playerID])

    // useEffect(() => {
    //     function onAnswerChecked({booleanResult}) {
    //         alert("Test "+booleanResult);
    //     }
    //     server.on('answerChecked', onAnswerChecked);

    //     return () => {
    //         server.off('answerChecked', onAnswerChecked);
    //     }
    // }, [])


    // useEffect(() => {
    //     const handleServerReset = () => {
    //         alert("Server has been reset");
    //         goToPage("Menu");
    //         setServerReset(false);
    //     };

    //     server.on('serverReset', handleServerReset);

    //     return () => {
    //         server.off('serverReset', handleServerReset);
    //     };
    // }, [goToPage]);

    return (
        <div>
            {currentMultiplayerScreen=="selectroom" && (
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
                        {selectedRoom!=null && (
                            <p>Waiting for server</p>
                        )}
                        <div>
                            <button onClick={()=>{
                                goToPage("Menu");
                                }}>Return to Menu</button>
                        </div>
                </div>
            </div>
            )}
            {currentMultiplayerScreen=="nameentry" && (
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
            {currentMultiplayerScreen=="roomwaiting" && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Waiting for opponent to join...</h2>
                    </div>
                </div>
            )}
            {currentMultiplayerScreen=="roomready" && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Choose your options or ready up!</h2>
                        <button onClick={handleEnterOptions}>Option</button>
                        <button onClick={handleReady}
                            disabled={isReady}>Ready</button>
                        <div>
                            <button onClick={()=>{
                                server.emit('exitRoom');
                                goToPage("Menu");
                                }}>Return to Menu</button>
                        </div>
                    </div>
                </div>
            )}
            {currentMultiplayerScreen=="roomoptions" && (
                <div className="modal">
                    <div className="modal-content">
                        {/* <h1>Welcome {userName}!</h1> */}
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
                            <h3 style={{textAlign:'center', display:'inline'}}>Round Length: </h3>
                            <input 
                                type="text" 
                                value={roundLengthInput} 
                                onChange={(e) => setRoundLengthInput(e.target.value)} 
                                placeholder="Default = 60" 
                                className='input'
                            />
                        </div>
                        <div>
                            <h3 style={{textAlign:'center', display:'inline'}}>Attempts Allowed: </h3>
                            <input 
                                type="text" 
                                value={attemptsAllowedInput} 
                                onChange={(e) => setAttemptsAllowedInput(e.target.value)} 
                                placeholder="Default = 3" 
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
                        <div>
                            <button onClick={handleOptionsSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
            {currentMultiplayerScreen=="gamescreen" && (
                <div>
                    <nav className="score-container">
                        <ul className="score-bar">
                            <li className="score-label player" style={{marginRight:'64px'}}>YOUR SCORE: {playerScore}</li>
                            <li className='score-label name'>{userName}</li>
                            <li className="score-label opponent">OPPONENT'S SCORE: {opponentScore}</li>
                        </ul>
                    </nav>
                    <div id="divider"></div>
                    <div style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        }}> 
                        {targetResult!==null && (
                            <div style={{fontSize: '18px',
                                fontWeight: '600', margin:'10px', marginRight:'50px'}}><>{targetResult}</></div>
                        )}
                        {timeLeft!=null && (
                            <div id ="countdown"style ={{position: 'relative',
                                height: '40px',
                                width: '40px',
                                textAlign: 'center'}}>
                                <div style={{color: 'black',
                                    display: 'inline-block',
                                    lineHeight: '40px',}} >{timeLeft}</div>
                                <svg style={{position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    width: '40px',
                                    height: '40px',
                                    transform: 'rotateY(-180deg) rotateZ(-90deg)'}}>
                                    <circle r="18" cx="20" cy="20" style={{strokeDasharray: '113px',
                                        strokeDashoffset: '0px',
                                        strokeLinecap: 'round',
                                        strokeWidth: '2px',
                                        stroke: 'black',
                                        fill: 'none',
                                        animation: timeLeft !== 0 && isRoundInProgress ? `countdown ${roundLength}s linear infinite forwards` : 'none'}}></circle>
                                </svg>
                            </div>
                        )}
                        {attemptsLeft!== null && (
                            <div style={{ fontSize: '18px', margin: '10px' }}>
                                {Array.from({ length: attemptsLeft }).map((_, index) => (
                                    <svg key={index} fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 471.701 471.701">
                                        <g>
                                            <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                                            c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                                            l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                                            C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                                            s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                                            c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                                            C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                                        </g>
                                    </svg>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* <button onClick={() => {
                        setTimeLeft(roundLength);
                    }}>Reset Timer</button>
                    <button onClick={() => {
                        setTimeLeft(5);
                    }}>Test button disable</button>
                    <button onClick={() => {
                        server.emit('requestNumbers');
                        setGetNumberButtonState(true);
                    }} disabled={getNumberButtonState}>Get numbers</button>
                    <button onClick={() => {
                        setTimeLeft(roundLength);
                        setBankNumbers([]);
                        setPlaySlotNumbers(Array(numbersLength).fill());
                        setPlaySlotOperators(Array(numbersLength).fill());
                        setGetNumberButtonState(false);
                    }}>Reset Room</button> */}
                    {/* <p>It is {isYourTurn ? "" : "not "}your turn</p> */}
                    <div style={{textAlign:'center'}}>
                        <button onClick={() => {
                                setTimeLeft(roundLength);
                                server.emit('requestNumbers');
                                setPlaySlotNumbers(Array(numbersLength).fill());
                                setPlaySlotOperators(Array(numbersLength-1).fill());
                                setIsRoundInProgress(!isRoundInProgress);
                                setAttemptsLeft(attemptsAllowed);
                                }
                            }
                            disabled = {isRoundInProgress || !isYourTurn}
                            
                        >Start</button>
                    </div>
                    {isYourTurn && (
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
                        isRoundInProgress={isRoundInProgress}
                        />
                    )}
                    {!isYourTurn && (
                        <h1 style={{textAlign:'center'}}>Please wait until it's your turn!</h1>
                    )}
                    <div className="center-button-container">
                        <button className="return" onClick={()=>{
                            server.emit('exitRoom');
                            goToPage("Menu");
                        }} style={{border: 'none', background: 'none',backgroundColor:'#f9f9f9', border:'1px solid 1px solid transparent', borderRadius:'8px', padding:'5px', margin:'5px'}}><svg width="32px" height="32px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#000000" fill-rule="evenodd" d="M4.297105,3.29289 L0.59,7 L4.297105,10.7071 C4.687635,11.0976 5.320795,11.0976 5.711315,10.7071 C6.101845,10.3166 6.101845,9.68342 5.711315,9.29289 L4.418425,8 L11.504215,8 C12.332615,8 13.004215,8.67157 13.004215,9.5 C13.004215,10.3284 12.332615,11 11.504215,11 L10.004215,11 C9.451935,11 9.004215,11.4477 9.004215,12 C9.004215,12.5523 9.451935,13 10.004215,13 L11.504215,13 C13.437215,13 15.004215,11.433 15.004215,9.5 C15.004215,7.567 13.437215,6 11.504215,6 L4.418425,6 L5.711315,4.70711 C6.101845,4.31658 6.101845,3.68342 5.711315,3.29289 C5.320795,2.90237 4.687635,2.90237 4.297105,3.29289 Z"/>
                      </svg></button>
                    </div>
                </div>
            )}
        </div>     
    )
}

export default Multiplayer;