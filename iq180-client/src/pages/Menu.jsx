// Menu.js
import React, { useState } from "react";
import { Howtoplay, Leaderboard } from "../components";
import RandomLetter from "../components/Effects";
import "../css/Menu.css";

function Menu({ goToPage }) {
    const [showRandomLetters, setShowRandomLetters] = useState(true);
    const [showHowtoplay, setShowHowtoplay] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const handleHowtoplayClick = () => {
        setShowHowtoplay(true);
    };

    const handleCloseHowtoplay = () => {
        setShowHowtoplay(false);
    };

    const handleLeaderboardClick = () => {
        setShowLeaderboard(true);
    };

    const handleCloseLeaderboard = () => {
        setShowLeaderboard(false);
    };

    return (
        <div className="menu-container">
            <div className="game-title">IQ180</div>
            <div className="all-menu-containter">
                <button
                    className="singleplayer-button"
                    onClick={() => goToPage("Singleplayer")}
                >
                    Singleplayer
                </button>
                <button
                    className="multiplayer-button"
                    onClick={() => goToPage("Multiplayer")}
                >
                    Multiplayer
                </button>
                <button
                    className="howtoplay-button"
                    onClick={handleHowtoplayClick}
                >
                    How to play
                </button>
                <button
                    className="leaderboard-button"
                    onClick={handleLeaderboardClick}
                >
                    Leaderboard
                </button>
            </div>
            {showHowtoplay && <Howtoplay onClose={handleCloseHowtoplay} />}
            {showLeaderboard && (
                <Leaderboard onClose={handleCloseLeaderboard} />
            )}
            <button
                style={{ position: "absolute", top: 0 }}
                onClick={() => setShowRandomLetters(!showRandomLetters)}
            >
                {showRandomLetters ? "close" : "on"}
            </button>
            {showRandomLetters && <RandomLetter />}
        </div>
    );
}

export default Menu;
