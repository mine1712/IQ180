import { useState, useEffect } from 'react';
import '../css/Singleplayer.css';
import {
    GameArea,
    ScoreBar,
    ReturnToMenuButton,
    NameEntry,
    OptionsMenu,
    StartButton,
    GameStatusDisplay
} from '../components';
import { generateNumbers } from '../utils/numberGenerator'
import { checkNumbersLength, checkRoundLength, checkAttemptsAllowed } from '../utils/checkOptionsInput';


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
    // Game Variables
    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
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

    const initializeSingleplayer = () => {
        setPlayerScore(0);
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength - 1).fill());
        setBankNumbers([]);
        setTimeLeft(null);
        setAttemptsLeft(null);
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
        if (userName==="") {
            alert("Username cannot be an empty string!");
            return;
        }
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
    }

    useEffect(() => {
        setPlaySlotNumbers(Array(numbersLength).fill());
        setPlaySlotOperators(Array(numbersLength - 1).fill());
    }, [numbersLength])

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
            try {
                playerAnswer = eval(equation);
                if (playerAnswer === targetResult) {
                    alert("Correct! The solution is valid.");
                    setIsRoundInProgress(false);
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
        } else if (orderOfOperations == "lefttoright") {
            let nums_check = numbers.filter((value) => value !== null);
            let operators_check = operators.filter((value) => value !== null);
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
        <div style={{height: '100vh', overflowY:'auto'}}>
            {currentSingleplayerScreen == "nameentry" && 
                <NameEntry userName={userName}
                    setUserName={setUserName}
                    handleNameSubmit={handleNameSubmit}
                />
            }
            {currentSingleplayerScreen == "gameoptions" && 
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
            {currentSingleplayerScreen == "gamescreen" && (
                <div>
                    <ScoreBar playerScore={playerScore}
                        userName={userName} />
                    <GameStatusDisplay targetResult={targetResult}
                        isRoundInProgress={isRoundInProgress}
                        timeLeft={timeLeft}
                        roundLength={roundLength}
                        attemptsLeft={attemptsLeft}
                    />
                    <StartButton setTimeLeft={setTimeLeft}
                        roundLength={roundLength}
                        setPlaySlotNumbers={setPlaySlotNumbers}
                        generateNumbers={generateNumbers}
                        numbersLength={numbersLength}
                        setPlaySlotOperators={setPlaySlotOperators}
                        setIsRoundInProgress={setIsRoundInProgress}
                        isRoundInProgress={isRoundInProgress}
                        setAttemptsLeft={setAttemptsLeft}
                        attemptsAllowed={attemptsAllowed}
                        isYourTurn={true}
                        setBankNumbers={setBankNumbers}
                        setTargetResult={setTargetResult}
                    />
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