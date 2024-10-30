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
            alert(server.id);
        }
    }, [server.id])

    useEffect(() => {
        function onUpdateScore(scores) {
            setPlayerScore(scores[playerID]);
            setPlaySlotNumbers(Array(numbersLength).fill());
            setPlaySlotOperators(Array(numbersLength-1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            alert("The next round is beginning");
        }
        function onSwapTurn(nextPlayer) {
            // alert(nextPlayer)
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
    }, [userName,playerID]);
    
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
        function onStartGame({turn, targetLength, attempt, orderofoperations}) {
            setNumbersLength(targetLength);
            setAttemptsAllowed(attempt);
            setOrderOfOperations(orderofoperations);
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
        setAttemptsLeft(attemptsLeft-1);
        setIsRoundInProgress(false);
    }

    useEffect(() => {
        function onWrongAnswer(attemptleft) {
            setIsRoundInProgress(true);
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
        function onOptions({targetLength, attempt, orderofoperations}) {
            setNumbersLengthInput(Integer.toString(targetLength));
            setAttemptsAllowedInput(Integer.toString(attempt));
            setOrderOfOperations(orderofoperations);
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
    
    // function checkRoundLength(str) {
    //     var n = Math.floor(Number(str));
    //     return n !== Infinity && String(n) === str && n >= 20 && n<=120;
    // }

    function checkAttemptsAllowed(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 1 && n<=5;
    }

    const handleOptionsSubmit = () => {
        let errors = [];
        if (!checkNumbersLength(numbersLengthInput)) {
            errors.push("Numbers must be an integer from 3-9");
        }
        // if (!checkRoundLength(roundLengthInput)) {
        //     errors.push("Round Length must be integer from 20-120");
        // }
        if (!checkAttemptsAllowed(attemptsAllowedInput)) {
            errors.push("Attempts Allowed must be integer from 1-5");
        }
        if (errors.length !== 0) {
            alert(errors.join("\n"));
            return;
        }
        setNumbersLength(parseInt(numbersLengthInput));
        // setRoundLength(parseInt(roundLengthInput));
        setAttemptsAllowed(parseInt(attemptsAllowedInput));
        server.emit("setOptions",{targetLength:parseInt(numbersLengthInput), attempt:parseInt(attemptsAllowedInput), orderofoperations:orderOfOperations});
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
            setPlaySlotNumbers(Array(numbersLength).fill());
            setPlaySlotOperators(Array(numbersLength-1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            if (turn==playerID) {
                setIsYourTurn(true);
                // setTimeLeft(60);
                // setCurrentMultiplayerScreen("gamescreen");
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
                        {/* <div>
                            <h3 style={{textAlign:'center', display:'inline'}}>Round Length: </h3>
                            <input 
                                type="text" 
                                value={roundLengthInput} 
                                onChange={(e) => setRoundLengthInput(e.target.value)} 
                                placeholder="Default = 60" 
                                className='input'
                            />
                        </div> */}
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
                    <h1>Your score = {playerScore}</h1>
                    {targetResult!==null && (
                        <h1>Target = {targetResult}</h1>
                    )}
                    {timeLeft!=null && (
                        <p>Time remaining = {timeLeft}</p>
                    )}
                    {attemptsLeft!== null && (
                        <p>Attempts left = {attemptsLeft}</p>
                    )}
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
                    <button onClick={()=>{
                        server.emit('exitRoom');
                        goToPage("Menu");
                    }}>Return to Menu</button>
                </div>
            )}
        </div>     
    )
}

export default Multiplayer;