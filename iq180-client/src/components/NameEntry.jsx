function NameEntry({ userName, setUserName, handleNameSubmit }) {
    return (
        <div className="form-container">
            <div className="set-welcome-text">Enter Your Name</div>
            <div className="input-container">
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="set-name-input"
                />
                <button className="set-name-button" onClick={handleNameSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default NameEntry;
