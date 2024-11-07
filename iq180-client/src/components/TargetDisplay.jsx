function TargetDisplay({ isRoundInProgress, targetResult }) {
    return (
        <div>
            <>{isRoundInProgress ? "Target: " + targetResult : null}</>
        </div>
    );
}

export default TargetDisplay;
