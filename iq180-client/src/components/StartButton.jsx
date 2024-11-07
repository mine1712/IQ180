function StartButton({
    setTimeLeft,
    roundLength,
    server,
    setPlaySlotNumbers,
    generateNumbers,
    numbersLength,
    setPlaySlotOperators,
    setIsRoundInProgress,
    isRoundInProgress,
    setAttemptsLeft,
    attemptsAllowed,
    isYourTurn,
    setBankNumbers,
    setTargetResult,
}) {
    return (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <button
                className="start-button"
                onClick={() => {
                    setTimeLeft(roundLength);
                    if (server !== undefined) {
                        server.emit("requestNumbers");
                    } else {
                        const generated = generateNumbers(numbersLength);
                        setBankNumbers(generated[0]);
                        setTargetResult(generated[1]);
                    }
                    setPlaySlotNumbers(Array(numbersLength).fill());
                    setPlaySlotOperators(Array(numbersLength - 1).fill());
                    setIsRoundInProgress(!isRoundInProgress);
                    setAttemptsLeft(attemptsAllowed);
                }}
                disabled={isRoundInProgress || !isYourTurn}
            >
                Start
            </button>
        </div>
    );
}

export default StartButton;
