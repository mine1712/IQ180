import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
import '../css/Multiplayer-temp.css';
import io from 'socket.io-client';
import {GameArea} from '../components';

const server = io.connect('http://localhost:5172');

function Multiplayer ({goToPage}) {
    const [currentMultiplayerScreen, setCurrentMultiplayerScreen] = useState("nameentry");
    const [playSlotNumbers,setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators,setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers,setBankNumbers] = useState([]);
    const [bankOperators,setBankOperators] = useState(['+','-','x','÷'])
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [userName, setUserName] = useState(null);
    const [timeLeft,setTimeLeft] = useState(null);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [isTimeUp,setIsTimeUp] = useState(false);
    const [targetResult,setTargetResult] = useState(null);
    const [getNumberButtonState,setGetNumberButtonState] = useState(false);
    const [privateRoomCode,setPrivateRoomCode] = useState(null);

    useEffect(() => {
        server.on('numbers', (data) => {
            setBankNumbers(data.numbers);
            setTargetResult(data.targetResult);
          });

        server.on("error", ({message}) => {
            alert("Error: "+message);
        })
    }, []);

    useEffect(() => {
        server.on("startGame", (firstPlayer) => {
            if (firstPlayer==userName) {
                setIsYourTurn(true);
                setTimeLeft(60);
                setCurrentMultiplayerScreen("gamescreen");
            }
            setCurrentMultiplayerScreen("gamescreen");
        })
    }, [userName])

    useEffect(() => {
        server.on('roomfull', () => {
            setSelectedRoom(null);
            alert("This room is full! Please select anothoer room");
        });
        if (selectedRoom!=null) {
            server.on('joinRoomSuccess', () => {
                // alert('success '+ selectedRoom);
                setCurrentRoom(selectedRoom);
                setSelectedRoom(null);
                setCurrentMultiplayerScreen("roomwaiting");
            });
        }
    }, [selectedRoom])

    useEffect(() => {
        if (timeLeft > 0 && isYourTurn) {
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
        // alert("Multiplayer submission has not been implemented yet.\nNumbers: " + playSlotNumbers + "\nOperators: "+ playSlotOperators)
        server.emit('checkAns', {nums: numbers, operators: operators, timeUsed: 60-timeLeft, room:currentRoom})
    }

    useEffect(() => {
        server.on('answerChecked', ({booleanResult}) => {
            alert("Test "+booleanResult);
        })
    }, [])

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
                    <h1>Target = {targetResult}</h1>
                    <p>Time remaining = {timeLeft}</p>
                    <button onClick={() => {
                        setTimeLeft(60);
                    }}>Reset Timer</button>
                    <button onClick={() => {
                        setTimeLeft(5);
                    }}>Test button disable</button>
                    <button onClick={() => {
                        server.emit('requestNumbers');
                        setGetNumberButtonState(true);
                    }} disabled={getNumberButtonState}>Get numbers</button>
                    <button onClick={() => {
                        setTimeLeft(60);
                        setBankNumbers([]);
                        setPlaySlotNumbers(Array(5).fill());
                        setPlaySlotOperators(Array(4).fill());
                        setGetNumberButtonState(false);
                    }}>Reset Room</button>
                    <p>It is {isYourTurn ? "" : "not "}your turn</p>
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