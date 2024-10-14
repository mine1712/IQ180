import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
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
    }, []);

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
            setIsYourTurn(true);
            setTimeLeft(60);
            setCurrentMultiplayerScreen("gamescreen");
        }
    }, [selectedRoom])

    const handleNameSubmit = () => {
        setCurrentMultiplayerScreen("selectroom");
    }

    const handleSubmission = () => {
        alert("Multiplayer submission has not been implemented yet.\nNumbers: " + playSlotNumbers + "\nOperators: "+ playSlotOperators)
    }

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
                    <p>It is {isYourTurn ? "" : "not"}your turn</p>
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
                    <button onClick={()=>goToPage("Menu")}>Return to Menu</button>
                </div>
            )}
        </div>     
    )
}

export default Multiplayer;