function TargetDisplay({ isRoundInProgress, targetResult }) {
    return (
        <div style={{
            fontSize: '18px',
            fontWeight: '600', margin: '10px', minWidth: '67px'
        }}><>{isRoundInProgress ? "Target: "+targetResult : null}</></div>
    )
}

export default TargetDisplay;