import ReturnToMenuButton from "./ReturnToMenuButton";

function SelectRoom({
    userName,
    handleRoomSelection,
    privateRoomCode,
    setPrivateRoomCode,
    selectedRoom,
    goToPage,
}) {
    return (
        <div className="form-container">
            <div className="multiplayer-welcome-container">
                <div className="set-welcome-text">Welcome {userName}!</div>
                <div className="set-welcome-text">Select a Room</div>
                <div className="input-container">
                    <button
                        className="set-room-button"
                        onClick={() => handleRoomSelection("Room 1")}
                    >
                        Room 1
                    </button>
                    <button
                        className="set-room-button"
                        onClick={() => handleRoomSelection("Room 2")}
                    >
                        Room 2
                    </button>
                    <button
                        className="set-room-button"
                        onClick={() => handleRoomSelection("Room 3")}
                    >
                        Room 3
                    </button>
                </div>
                <div className="enter-private-container">
                    <div className="set-welcome-text">
                        Enter a Private Room Code
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            value={privateRoomCode}
                            onChange={(e) => setPrivateRoomCode(e.target.value)}
                            placeholder="Your Code"
                            className="set-name-input"
                        />
                        <button
                            className="set-name-button"
                            onClick={() => handleRoomSelection(privateRoomCode)}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                {selectedRoom != null && <p>Waiting for server</p>}
                <ReturnToMenuButton
                    onClick={() => {
                        goToPage("Menu");
                    }}
                />
            </div>
        </div>
    );
}

export default SelectRoom;
