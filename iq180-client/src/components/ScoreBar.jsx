function ScoreBar({ playerScore, userName, opponentScore }) {
    return (
        <>
            <div>
                <div>
                    <span>YOUR SCORE: {playerScore}</span>
                    {opponentScore !== undefined && (
                        <li className="score-label opponent">
                            OPPONENT'S SCORE: {opponentScore}
                        </li>
                    )}
                </div>
            </div>
            <div id="divider"></div>
        </>
    );
}

export default ScoreBar;
