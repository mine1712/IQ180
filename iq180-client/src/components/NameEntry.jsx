function NameEntry({ userName, setUserName, handleNameSubmit }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Enter Your Name</h2>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className='input'
                />
                <button onClick={handleNameSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default NameEntry;