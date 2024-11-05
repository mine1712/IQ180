function OptionsMenu({
    userName,
    numbersLengthInput,
    setNumbersLengthInput,
    orderOfOperations,
    setOrderOfOperations,
    roundLengthInput,
    setRoundLengthInput,
    attemptsAllowedInput,
    setAttemptsAllowedInput,
    handleOptionsSubmit,
}) {
    return (
        <div className="form-container">
            <div className="welcome-container">
                {userName !== undefined && (
                    <div className="set-welcome-text">Welcome {userName}!</div>
                )}
                <div className="set-welcome-text">Choose your options</div>
                <div className="option-container">
                    <div className="option-text-container">
                        <div>
                            <div>
                                <div className="option-design">
                                    <span>Numbers</span>
                                </div>
                                <input
                                    type="text"
                                    value={numbersLengthInput}
                                    onChange={(e) =>
                                        setNumbersLengthInput(e.target.value)
                                    }
                                    placeholder="Default = 5"
                                    className="set-name-input"
                                />
                            </div>
                            <div>
                                <div className="option-design">
                                    <span>Order of Operation</span>
                                </div>
                                <select
                                    value={orderOfOperations}
                                    onChange={(e) =>
                                        setOrderOfOperations(e.target.value)
                                    }
                                >
                                    <option value="pemdas">PEMDAS</option>
                                    <option value="lefttoright">
                                        Left to Right
                                    </option>
                                </select>
                            </div>
                            <div>
                                <div className="option-design">
                                    <span>Round Length</span>
                                </div>
                                <input
                                    type="text"
                                    value={roundLengthInput}
                                    onChange={(e) =>
                                        setRoundLengthInput(e.target.value)
                                    }
                                    placeholder="Default = 60"
                                    className="set-name-input"
                                />
                            </div>
                            <div>
                                <div className="option-design">
                                    <span>Attempts Allowed</span>
                                </div>
                                <input
                                    type="text"
                                    value={attemptsAllowedInput}
                                    onChange={(e) =>
                                        setAttemptsAllowedInput(e.target.value)
                                    }
                                    placeholder="Default = 3"
                                    className="set-name-input"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div>
                        <h3 style={{ textAlign: "center", display: "inline" }}>
                            Numbers:{" "}
                        </h3>
                        <input
                            type="text"
                            value={numbersLengthInput}
                            onChange={(e) =>
                                setNumbersLengthInput(e.target.value)
                            }
                            placeholder="Default = 5"
                            className="set-name-input"
                        />
                    </div> */}
                    {/* <div>
                        <h3 style={{ textAlign: "center", display: "inline" }}>
                            Order of Operation:{" "}
                        </h3>
                        <select
                            value={orderOfOperations}
                            onChange={(e) =>
                                setOrderOfOperations(e.target.value)
                            }
                        >
                            <option value="pemdas">PEMDAS</option>
                            <option value="lefttoright">Left to Right</option>
                        </select>
                    </div> */}
                    {/* <div>
                        <h3 style={{ textAlign: "center", display: "inline" }}>
                            Round Length:{" "}
                        </h3>
                        <input
                            type="text"
                            value={roundLengthInput}
                            onChange={(e) =>
                                setRoundLengthInput(e.target.value)
                            }
                            placeholder="Default = 60"
                            className="set-name-input"
                        />
                    </div> */}
                    {/* <div>
                        <h3 style={{ textAlign: "center", display: "inline" }}>
                            Attempts Allowed:{" "}
                        </h3>
                        <input
                            type="text"
                            value={attemptsAllowedInput}
                            onChange={(e) =>
                                setAttemptsAllowedInput(e.target.value)
                            }
                            placeholder="Default = 3"
                            className="set-name-input"
                        />
                    </div> */}

                    <button
                        className="set-name-button"
                        onClick={handleOptionsSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OptionsMenu;
