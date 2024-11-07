// Howtoplay.js
import React from "react";
import "../css/Howtoplay.css";

const Howtoplay = ({ onClose }) => {
    return (
        <div className="howtoplay-modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>
                    &times;
                </span>
                <h2 style={{ textAlign: "center" }}>How to Play</h2>
                <p>
                    The goal of IQ180 is to solve mathematical equations by
                    selecting the correct digits or operators in a limited
                    amount of time. Players score points by solving equations
                    correctly, while avoiding incorrect selections that could
                    lead to penalties.
                </p>
                <h2 style={{ textAlign: "center" }}> Rules </h2>
                <p id="howtoplay-line1">
                    {" "}
                    Click or drag the buttons to select the digits or operators
                    needed to complete the equation.
                </p>
                <p id="howtoplay-line2">
                    {" "}
                    Each number can only be used once, but operators can be repeated.
                </p>
                <p id="howtoplay-line3">
                    In multiplayer, if both players submit correctly, the faster player wins.
                </p>
                <p id="howtoplay-line4">
                    Incorrect selections will take away lives, so think
                    carefully before submitting.
                </p>
            </div>
        </div>
    );
};

export default Howtoplay;
