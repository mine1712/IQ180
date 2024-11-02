import TargetDisplay from "./TargetDisplay";
import Timer from "./Timer";
import AttemptsDisplay from "./AttemptsDisplay";

function GameStatusDisplay({
    targetResult,
    isRoundInProgress,
    timeLeft,
    roundLength,
    attemptsLeft
}) {
    return (
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
    )
}

export default GameStatusDisplay;