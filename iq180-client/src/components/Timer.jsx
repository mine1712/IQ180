import { useState, useEffect } from "react";

function Timer({ timeLeft, roundLength }) {
    const [dashOffSet, setDashOffSet] = useState(113);

    useEffect(() => {
        const circumference = 2 * Math.PI * 18;
        const offset = circumference - (timeLeft / roundLength) * circumference;
        setDashOffSet(offset);
    }, [timeLeft, roundLength]);

    return (
        <div
            id="countdown"
            style={{
                position: "relative",
                height: "40px",
                width: "40px",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    color: "#4AC29A",
                    display: "inline-block",
                    lineHeight: "40px",
                }}
            >
                {timeLeft}
            </div>
            <svg
                style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "40px",
                    height: "40px",
                    transform: "rotateY(-180deg) rotateZ(-90deg)",
                }}
            >
                <circle
                    r="18"
                    cx="20"
                    cy="20"
                    style={{
                        strokeDasharray: "113px",
                        strokeDashoffset: `${dashOffSet}px`,
                        strokeLinecap: "round",
                        strokeWidth: "2px",
                        stroke: "#4AC29A",
                        fill: "none",
                        transition: "stroke-dashoffset 1s linear",
                    }}
                ></circle>
            </svg>
        </div>
    );
}

export default Timer;
