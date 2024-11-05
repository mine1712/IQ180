import TargetDisplay from "./TargetDisplay";
import Timer from "./Timer";
import AttemptsDisplay from "./AttemptsDisplay";

function GameStatusDisplay({
    targetResult,
    isRoundInProgress,
    timeLeft,
    roundLength,
    attemptsLeft,
}) {
    return (
        <>
            <div className="target-attempt-container">
                <div className="target-container">
                    {targetResult !== null && (
                        <TargetDisplay
                            isRoundInProgress={isRoundInProgress}
                            targetResult={targetResult}
                        />
                    )}
                </div>
                <div className="attempt-container">
                    {attemptsLeft !== null && (
                        <AttemptsDisplay attemptsLeft={attemptsLeft} />
                    )}
                </div>
            </div>
            <div className="time-container">
                {timeLeft != null && (
                    <Timer timeLeft={timeLeft} roundLength={roundLength} />
                )}
            </div>
        </>
    );
}

export default GameStatusDisplay;
