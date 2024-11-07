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
        <div className="target-attempt-container">
            <div className="target-time">
                {targetResult !== null && (
                    <div className="target-container">
                        <TargetDisplay
                            isRoundInProgress={isRoundInProgress}
                            targetResult={targetResult}
                        />
                    </div>
                )}
                {attemptsLeft !== null && (
                    <div className="attempt-container">
                        <AttemptsDisplay attemptsLeft={attemptsLeft} />
                    </div>
                )}
            </div>

            {timeLeft != null && (
                <div className="time-container">
                    <Timer timeLeft={timeLeft} roundLength={roundLength} />
                </div>
            )}
        </div>
    );
}

export default GameStatusDisplay;
