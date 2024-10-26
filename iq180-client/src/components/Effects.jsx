import React, { useEffect, useState } from "react";

const RandomLetter = () => {
    /*Randomly picks a symbol between the available ones */
    const [letters, setLetters] = useState([]);

    const getColorForSymbol = (symbol) => {
        switch (symbol) {
            case "+":
                return "white";
            case "-":
                return "white";
            case "÷":
                return "white";
            case "x":
                return "white";
            case "%":
                return "white";
            default:
                return "white";
        }
    };

    useEffect(() => {
        const generateRandomLetter = () => {
            const lettersArray = "+-÷%x";
            const randomIndex = Math.floor(Math.random() * lettersArray.length);
            const symbol = lettersArray[randomIndex];
            const newLetter = {
                char: symbol,
                left: Math.random() * window.innerWidth,
                top: -40,
                color: getColorForSymbol(symbol),
            };
            setLetters((prevLetters) => [...prevLetters, newLetter]);
        };

        const interval = setInterval(() => {
            generateRandomLetter();
        }, 180);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fallInterval = setInterval(() => {
            setLetters((prevLetters) =>
                prevLetters
                    .map((letter) => ({
                        ...letter,
                        top: letter.top + 5,
                    }))
                    .filter((letter) => letter.top < window.innerHeight)
            );
        }, 40);

        return () => clearInterval(fallInterval);
    }, []);

    return (
        <div>
            {letters.map((letter, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        left: letter.left,
                        top: letter.top,
                        fontSize: "36px",
                        color: letter.color,
                        // textShadow:
                        //   "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
                    }}
                >
                    {letter.char}
                </div>
            ))}
        </div>
    );
};

export default RandomLetter;
