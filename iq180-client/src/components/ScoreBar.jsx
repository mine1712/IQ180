function ScoreBar({ playerScore, userName, opponentScore }) {
    return (
        <>
            <div className="player-container">
                <span>
                    {userName}: {playerScore}
                </span>
            </div>
            {opponentScore !== undefined && (
                <div className="opplayer-container">
                    <span>OPPONENT'S SCORE: {opponentScore}</span>
                </div>
            )}
            <div id="divider"></div>
        </>
    );
}

export default ScoreBar;
