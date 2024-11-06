function ScoreBar({ playerScore, userName, opponentScore, opponent }) {
    return (
        <>
            <div className="player-container">
                <span>
                    {userName}: {playerScore}
                </span>
            </div>
            {opponentScore !== undefined && (
                <div className="opplayer-container">
                    <span>{opponent}: {opponentScore}</span>
                </div>
            )}
            <div id="divider"></div>
        </>
    );
}

export default ScoreBar;
