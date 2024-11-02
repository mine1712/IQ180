function TargetDisplay({ isRoundInProgress, targetResult }) {
    return (
        <div style={{
            fontSize: '18px',
            fontWeight: '600', margin: '10px', minWidth: '67px'
        }}><>{isRoundInProgress ? targetResult : null}</></div>
    )
}

export default TargetDisplay;