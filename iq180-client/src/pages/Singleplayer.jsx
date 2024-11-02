import { useState, useEffect } from 'react';
import '../css/Singleplayer.css';
import { GameArea, ScoreBar, TargetDisplay, AttemptsDisplay, Timer, ReturnToMenuButton } from '../components';
import { generateNumbers } from '../utils/numberGenerator'

const Singleplayer = ({ goToPage }) => {
    // Screen Value
    const [currentSingleplayerScreen, setCurrentSingleplayerScreen] = useState("nameentry");
    // Player Info
    const [playerScore, setPlayerScore] = useState(0);
    const [userName, setUserName] = useState("");
    // Game Field Values
    const [playSlotNumbers, setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators, setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers, setBankNumbers] = useState([]);
    const [bankOperators, setBankOperators] = useState(['+', '-', 'x', '÷'])
    // const [selectedRoom, setSelectedRoom] = useState(null);
    // Game Variables
    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const [isRoundInProgress, setIsRoundInProgress] = useState(false);
    const [targetResult, setTargetResult] = useState(null);
    const [playerLost, setPlayerLost] = useState(false);
    // Configurable values
    const [numbersLengthInput, setNumbersLengthInput] = useState("5");
    const [numbersLength, setNumbersLength] = useState(5);
    const [orderOfOperations, setOrderOfOperations] = useState("pemdas");
    const [roundLengthInput, setRoundLengthInput] = useState("60")
    const [roundLength, setRoundLength] = useState(60);
    const [attemptsAllowedInput, setAttemptsAllowedInput] = useState("3");
    const [attemptsAllowed, setAttemptsAllowed] = useState(3);
    const [attemptsLeft, setAttemptsLeft] = useState(null);
    // const [getNumberButtonState,setGetNumberButtonState] = useState(false);
    // const [privateRoomCode,setPrivateRoomCode] = useState(null);

    const initializeSingleplayer = () => {
        setPlayerScore(0);
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength - 1).fill());
        setBankNumbers([]);
        setTimeLeft(null);
        setAttemptsLeft(null);
        setIsYourTurn(false);
        setIsTimeUp(false);
        setTargetResult(null);
        setIsRoundInProgress(false);
        setPlayerLost(false);
    }

    useEffect(() => {
        if (timeLeft > 0 && isRoundInProgress) {
            setIsTimeUp(false);
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            if (isRoundInProgress) {
                setIsTimeUp(true);
                setPlayerLost(true);
            }
        }
    }, [timeLeft]);

    const handleNameSubmit = () => {
        setCurrentSingleplayerScreen("gameoptions");
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
        setCurrentSingleplayerScreen("gamescreen");
        // alert(checkNumbersLength(numbersLength));
    }

    useEffect(() => {
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength - 1).fill());
    }, [numbersLength])

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

    const handleSubmission = (numbers, operators) => {
        if (orderOfOperations == "pemdas") {
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
                    setIsYourTurn(false)
                    setPlayerScore(playerScore + 1);
                    return true;
                } else {
                    alert(`Incorrect. The result is ${playerAnswer}, but ${targetResult} was expected.`);
                    setAttemptsLeft(attemptsLeft - 1);
                    return false;
                }
            } catch (error) {
                alert("Error in the expression. Please ensure it is well-formed.");
                setAttemptsLeft(attemptsLeft - 1);
                return false;
            }
            // const playerAnswer = eval(equation);
            // alert("Player Answer: "+playerAnswer+"\nTarget: "+targetResult);
            // return 
        } else if (orderOfOperations == "lefttoright") {
            let nums_check = numbers.filter((value) => value !== null);
            let operators_check = operators.filter((value) => value !== null);
            // let booleanResult;
            if (nums_check.length === numbersLength && operators_check.length === (numbersLength - 1)) {
                let result = numbers[0];
                for (let i = 1; i < numbers.length; i++) {
                    switch (operators[i - 1]) {
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
                    setPlayerScore(playerScore + 1);
                    return true;
                } else {
                    alert(`Incorrect. The result is ${result}, but ${targetResult} was expected.`);
                    setAttemptsLeft(attemptsLeft - 1);
                    return false;
                }
            }
            alert("Error in the expression. Please ensure it is well-formed.");
            setAttemptsLeft(attemptsLeft - 1);
            return false;
        }

    }

    useEffect(() => {
        if (attemptsLeft === 0) {
            setTimeLeft(0);
            setPlayerLost(true);
        }
    }, [attemptsLeft])

    return (
        <div>
            {currentSingleplayerScreen == "nameentry" && (
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
            {currentSingleplayerScreen == "gameoptions" && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Welcome {userName}!</h1>
                        <h2>Choose your options</h2>
                        <div>
                            <h3 style={{ textAlign: 'center', display: 'inline' }}>Numbers: </h3>
                            <input
                                type="text"
                                value={numbersLengthInput}
                                onChange={(e) => setNumbersLengthInput(e.target.value)}
                                placeholder="Default = 5"
                                className='input'
                            />
                        </div>
                        <div>
                            <h3 style={{ textAlign: 'center', display: 'inline' }}>Order of Operation: </h3>
                            <select value={orderOfOperations}
                                onChange={(e) => setOrderOfOperations(e.target.value)}
                            >
                                <option value="pemdas">PEMDAS</option>
                                <option value="lefttoright">Left to Right</option>
                            </select>
                        </div>
                        <div>
                            <h3 style={{ textAlign: 'center', display: 'inline' }}>Round Length: </h3>
                            <input
                                type="text"
                                value={roundLengthInput}
                                onChange={(e) => setRoundLengthInput(e.target.value)}
                                placeholder="Default = 60"
                                className='input'
                            />
                        </div>
                        <div>
                            <h3 style={{ textAlign: 'center', display: 'inline' }}>Attempts Allowed: </h3>
                            <input
                                type="text"
                                value={attemptsAllowedInput}
                                onChange={(e) => setAttemptsAllowedInput(e.target.value)}
                                placeholder="Default = 3"
                                className='input'
                            />
                        </div>
                        <button onClick={handleOptionsSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {currentSingleplayerScreen == "gamescreen" && (
                <div>
                    <ScoreBar playerScore={playerScore}
                        userName={userName} />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                    }}>
                        {targetResult !== null && <TargetDisplay isRoundInProgress={isRoundInProgress} targetResult={targetResult} />}
                        {timeLeft != null && <Timer timeLeft={timeLeft} roundLength={roundLength} />}
                        {attemptsLeft !== null && <AttemptsDisplay attemptsLeft={attemptsLeft} />}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={() => {
                            // setIsYourTurn(true);
                            setTimeLeft(roundLength);
                            const generated = generateNumbers(numbersLength);
                            setBankNumbers(generated[0]);
                            setTargetResult(generated[1]);
                            setPlaySlotNumbers(Array(numbersLength).fill());
                            setPlaySlotOperators(Array(numbersLength - 1).fill());
                            setIsRoundInProgress(!isRoundInProgress);
                            setAttemptsLeft(attemptsAllowed);
                        }
                        }
                            disabled={isRoundInProgress}

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
                    {playerLost && (
                        <h1 style={{ textAlign: 'center' }}>You lost! Try again?</h1>
                    )}
                    <div style={{ textAlign: 'center' }}>
                        {playerLost && (
                            <button onClick={initializeSingleplayer}>Restart Game</button>
                        )}
                        <ReturnToMenuButton onClick={() => {
                            goToPage("Menu");
                        }} />
                    </div>

                </div>
            )}
        </div>
    )
}

export default Singleplayer;