import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
import { server } from '../socket'
import {
    GameArea,
    ScoreBar,
    ReturnToMenuButton,
    NameEntry,
    OptionsMenu,
    SelectRoom,
    RoomReady,
    StartButton,
    GameStatusDisplay
} from '../components';

function Multiplayer({ goToPage }) {
    // Screen Value
    const [currentMultiplayerScreen, setCurrentMultiplayerScreen] = useState("nameentry");
    // Player Info
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOponentScore] = useState(0);
    const [userName, setUserName] = useState("");
    const [playerID, setPlayerID] = useState(null);
    // Game Field Values
    const [playSlotNumbers, setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators, setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers, setBankNumbers] = useState([]);
    const [bankOperators, setBankOperators] = useState(['+', '-', 'x', '÷'])
    // Room variables
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [privateRoomCode, setPrivateRoomCode] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [waitOptions, setWaitOptions] = useState(false);
    // Game Variables
    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [isRoundInProgress, setIsRoundInProgress] = useState(false);
    const [targetResult, setTargetResult] = useState(null);
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

        function onError({ message }) {
            alert("Error: " + message);
        }

        function onGetReady() {
            setCurrentMultiplayerScreen("roomready");
        }

        function onWrongAnswer(attemptleft) {
            // if (attemptleft===0) {
            //     setIsRoundInProgress(false);
            // }
            setAttemptsLeft(attemptleft);
            alert("Your answer was incorrect!");
        }

        function onOptions({ targetLength, attempt, orderofoperations, roundLength }) {
            setNumbersLengthInput(targetLength.toString());
            setAttemptsAllowedInput(attempt.toString());
            setOrderOfOperations(orderofoperations);
            setRoundLengthInput(roundLength.toString());
            setWaitOptions(false);
            setCurrentMultiplayerScreen("roomoptions");
        }
        
        server.on('numbers', onNumbers);
        server.on("error", onError);
        server.on("getReady", onGetReady);
        server.on("wrongAnswer", onWrongAnswer);
        server.on("options", onOptions);

        return () => {
            server.off('numbers', onNumbers);
            server.off("error", onError);
            server.off("getReady", onGetReady);
            server.off("wrongAnswer", onWrongAnswer);
            server.off("options", onOptions);
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
            setPlaySlotOperators(Array(numbersLength - 1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            setAttemptsLeft(null);
            alert("The next round is beginning");
        }
        function onSwapTurn(nextPlayer) {
            // alert(nextPlayer)
            setIsRoundInProgress(false);
            if (nextPlayer == playerID) {
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
    }, [numbersLength, playerID]);

    useEffect(() => {
        function onStartGame({ turn, targetLength, attempt, orderofoperations, roundLength }) {
            setNumbersLength(targetLength);
            setAttemptsAllowed(attempt);
            setOrderOfOperations(orderofoperations);
            setRoundLength(roundLength);
            if (turn == playerID) {
                setIsYourTurn(true);
                // setTimeLeft(60);
                setCurrentMultiplayerScreen("gamescreen");
            }
            setCurrentMultiplayerScreen("gamescreen");
        }

        function onResetRoom({ turn, targetLength, attempt, orderofoperations }) {
            setNumbersLength(targetLength);
            setAttemptsAllowed(attempt);
            setOrderOfOperations(orderofoperations);
            setIsRoundInProgress(false);
            setPlayerScore(0);
            setPlaySlotNumbers(Array(targetLength).fill());
            setPlaySlotOperators(Array(targetLength - 1).fill());
            setTimeLeft(null);
            setTargetResult(null);
            setAttemptsLeft(null);
            if (turn == playerID) {
                setIsYourTurn(true);
            } else {
                setIsYourTurn(false);
            }
        }

        server.on("startGame", onStartGame);
        server.on("resetRoom", onResetRoom)

        return () => {
            server.off("startGame", onStartGame);
            server.off("resetRoom", onResetRoom);
        }
    }, [playerID])

    useEffect(() => {
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength - 1).fill());
    }, [numbersLength])

    useEffect(() => {
        function onRoomFull() {
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
        if (selectedRoom != null) {
            server.emit('joinRoom', { room: selectedRoom, name: userName });
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
            if (currentMultiplayerScreen == "gamescreen") {
                alert("Your opponent \"" + name + "\" has left the room.\nPlease return to the menu.");
                setIsRoundInProgress(false);
                setIsYourTurn(false);
            }
        }

        server.on("userDisconnected", onUserDisconnected);

        // Check connection status on mount
        // setIsConnected(server.connected);

        // Listen for connection and disconnection events
        // server.on('connect', () => setIsConnected(true));
        // server.on('disconnect', () => setIsConnected(false));

        return () => {
            server.off("userDisconnected", onUserDisconnected);
            // server.off('connect');
            // server.off('disconnect');
        }
    }, [currentMultiplayerScreen])

    useEffect(() => {
        if (isTimeUp && isRoundInProgress && !timeLeft) {
            setIsRoundInProgress(false);
            server.emit('checkAns', { nums: Array(numbersLength).fill(), operators: Array(numbersLength - 1).fill(), timeUsed: roundLength - timeLeft, room: currentRoom, attemptleft: 0, isTimeUp: true });
        }
        if (timeLeft > 0 && isRoundInProgress) {
            setIsTimeUp(false);
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && isRoundInProgress) {
            setIsTimeUp(true);
        }
    }, [timeLeft, isRoundInProgress]);

    const handleRoomSelection = (room) => {
        setSelectedRoom(room);
    }

    

    const handleNameSubmit = () => {
        setCurrentMultiplayerScreen("selectroom");
    }

    const handleSubmission = (numbers, operators) => {
        // alert(timeLeft);
        server.emit('checkAns', { nums: numbers, operators: operators, timeUsed: roundLength - timeLeft, room: currentRoom, attemptleft: attemptsLeft, isTimeUp: isTimeUp });
        // setAttemptsLeft(attemptsLeft-1);
    }

    const handleEnterOptions = () => {
        server.emit("getOption");
        setWaitOptions(true);
    }

    function checkNumbersLength(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 3 && n <= 9;
    }

    function checkRoundLength(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 20 && n <= 120;
    }

    function checkAttemptsAllowed(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 1 && n <= 5;
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
        server.emit("setOptions", { targetLength: parseInt(numbersLengthInput), attempt: parseInt(attemptsAllowedInput), orderofoperations: orderOfOperations, roundLength: parseInt(roundLengthInput) });
        setCurrentMultiplayerScreen("roomready");
    }

    const handleReady = () => {
        server.emit("playerReady");
        setIsReady(true);
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
        <div style={{height: '100vh', overflowY:'auto'}}>
            {currentMultiplayerScreen == "nameentry" && 
                <NameEntry userName={userName}
                    setUserName={setUserName}
                    handleNameSubmit={handleNameSubmit}
                />
            }
            {currentMultiplayerScreen == "selectroom" && 
                <SelectRoom userName={userName}
                    handleRoomSelection={handleRoomSelection}
                    privateRoomCode={privateRoomCode}
                    setPrivateRoomCode={setPrivateRoomCode}
                    selectedRoom={selectedRoom}
                    goToPage={goToPage}
                />
            }
            {currentMultiplayerScreen == "roomwaiting" && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Waiting for opponent to join...</h2>
                    </div>
                </div>
            )}
            {currentMultiplayerScreen == "roomready" && 
                <RoomReady handleEnterOptions={handleEnterOptions}
                    handleReady={handleReady}
                    isReady={isReady}
                    waitOptions={waitOptions}
                    server={server}
                    goToPage={goToPage}
                />
            }
            {currentMultiplayerScreen == "roomoptions" && 
                <OptionsMenu userName={userName}
                    numbersLengthInput={numbersLengthInput}
                    setNumbersLengthInput={setNumbersLengthInput}
                    orderOfOperations={orderOfOperations}
                    setOrderOfOperations={setOrderOfOperations}
                    roundLengthInput={roundLengthInput}
                    setRoundLengthInput={setRoundLengthInput}
                    attemptsAllowedInput={attemptsAllowedInput}
                    setAttemptsAllowedInput={setAttemptsAllowedInput}
                    handleOptionsSubmit={handleOptionsSubmit}
                />
            }
            {currentMultiplayerScreen == "gamescreen" && (
                <div>
                    <ScoreBar playerScore={playerScore}
                        userName={userName}
                        opponentScore={opponentScore} />
                    <GameStatusDisplay targetResult={targetResult}
                        isRoundInProgress={isRoundInProgress}
                        timeLeft={timeLeft}
                        roundLength={roundLength}
                        attemptsLeft={attemptsLeft}
                    />
                    <StartButton setTimeLeft={setTimeLeft}
                        roundLength={roundLength}
                        server={server}
                        setPlaySlotNumbers={setPlaySlotNumbers}
                        numbersLength={numbersLength}
                        setPlaySlotOperators={setPlaySlotOperators}
                        setIsRoundInProgress={setIsRoundInProgress}
                        isRoundInProgress={isRoundInProgress}
                        setAttemptsLeft={setAttemptsLeft}
                        attemptsAllowed={attemptsAllowed}
                        isYourTurn={isYourTurn}
                    />
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
                            isRoundInProgress={isRoundInProgress}
                        />
                    )}
                    {!isYourTurn && (
                        <h1 style={{ textAlign: 'center' }}>Please wait until it's your turn!</h1>
                    )}
                    <ReturnToMenuButton onClick={() => {
                        server.emit('exitRoom');
                        goToPage("Menu");
                    }} />
                </div>
            )}
        </div>
    )
}

export default Multiplayer;