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
    handleOptionsSubmit
}) {
    return (
        <div className="modal">
            <div className="modal-content">
                {userName !== undefined && <h1>Welcome {userName}!</h1>}
                <h2>Choose your options</h2>
                <div>
                    <h3 style={{ textAlign: 'center', display: 'inline' }}>Numbers: </h3>
                    <input
                        type="text"
                        value={numbersLengthInput}
                        onChange={(e) => setNumbersLengthInput(e.target.value)}
                        placeholder="Default = 5"
                        className='input'
                    />
                </div>
                <div>
                    <h3 style={{ textAlign: 'center', display: 'inline' }}>Order of Operation: </h3>
                    <select value={orderOfOperations}
                        onChange={(e) => setOrderOfOperations(e.target.value)}
                    >
                        <option value="pemdas">PEMDAS</option>
                        <option value="lefttoright">Left to Right</option>
                    </select>
                </div>
                <div>
                    <h3 style={{ textAlign: 'center', display: 'inline' }}>Round Length: </h3>
                    <input
                        type="text"
                        value={roundLengthInput}
                        onChange={(e) => setRoundLengthInput(e.target.value)}
                        placeholder="Default = 60"
                        className='input'
                    />
                </div>
                <div>
                    <h3 style={{ textAlign: 'center', display: 'inline' }}>Attempts Allowed: </h3>
                    <input
                        type="text"
                        value={attemptsAllowedInput}
                        onChange={(e) => setAttemptsAllowedInput(e.target.value)}
                        placeholder="Default = 3"
                        className='input'
                    />
                </div>
                <div>
                    <button onClick={handleOptionsSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default OptionsMenu;