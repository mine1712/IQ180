function ScoreBar({ playerScore, userName, opponentScore }) {
    return (
        <>
            <nav className="score-container">
                <ul className="score-bar">
                    <li className="score-label player" style={{ marginRight: '64px' }}>YOUR SCORE: {playerScore}</li>
                    <li className='score-label name'>{userName}</li>
                    {opponentScore !== undefined && <li className="score-label opponent">OPPONENT'S SCORE: {opponentScore}</li>}
                </ul>
            </nav>
            <div id="divider"></div>
        </>
    )
}

export default ScoreBar;