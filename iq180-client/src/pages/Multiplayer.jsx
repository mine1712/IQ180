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
    // Game Field Values
    const [playSlotNumbers,setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators,setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers,setBankNumbers] = useState([]);
    const [bankOperators,setBankOperators] = useState(['+','-','x','÷'])
    // Room variables
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [privateRoomCode,setPrivateRoomCode] = useState("");
    // Game Variables
    const [timeLeft,setTimeLeft] = useState(null);
    const [isTimeUp,setIsTimeUp] = useState(false);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [isRoundInProgress,setIsRoundInProgress] = useState(false);
    const [targetResult,setTargetResult] = useState(null);
    // const [getNumberButtonState,setGetNumberButtonState] = useState(false);
    // TODO: Configurable values
    const [roundLength, setRoundLength] = useState(60);
    const [numbersLength, setNumbersLength] = useState(5);

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
        function onUpdateScore(scores) {
            setPlayerScore(scores[userName]);
            setPlaySlotNumbers(Array(numbersLength).fill());
            setPlaySlotOperators(Array(numbersLength-1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            alert("The next round is beginning");
        }
        function onSwapTurn(nextPlayer) {
            // alert(nextPlayer)
            if (nextPlayer==userName) {
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
    }, [userName]);

    useEffect(() => {
        function onStartGame(firstPlayer) {
            if (firstPlayer==userName) {
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
    }, [userName])

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

    useEffect(() => {
        if (timeLeft > 0 && isRoundInProgress) {
            setIsTimeUp(false);
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsTimeUp(true);
        }
    }, [timeLeft]);

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
        server.emit('checkAns', {nums: numbers, operators: operators, timeUsed: roundLength-timeLeft, room:currentRoom})
        setIsRoundInProgress(false);
    }

    // useEffect(() => {
    //     function onAnswerChecked({booleanResult}) {
    //         alert("Test "+booleanResult);
    //     }
    //     server.on('answerChecked', onAnswerChecked);

    //     return () => {
    //         server.off('answerChecked', onAnswerChecked);
    //     }
    // }, [])

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
            {currentMultiplayerScreen=="gamescreen" && (
                <div>
                    <h1>Your score = {playerScore}</h1>
                    {targetResult!==null && (
                        <h1>Target = {targetResult}</h1>
                    )}
                    {timeLeft!=null && (
                        <p>Time remaining = {timeLeft}</p>
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
                    <p>It is {isYourTurn ? "" : "not "}your turn</p>
                    <div style={{textAlign:'center'}}>
                        <button onClick={() => {
                                setTimeLeft(roundLength);
                                server.emit('requestNumbers');
                                setPlaySlotNumbers(Array(numbersLength).fill());
                                setPlaySlotOperators(Array(numbersLength-1).fill());
                                setIsRoundInProgress(!isRoundInProgress);
                                // setAttemptsLeft(attemptsAllowed);
                                }
                            }
                            disabled = {isRoundInProgress || !isYourTurn}
                            
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
                        isRoundInProgress={isRoundInProgress}
                    />
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