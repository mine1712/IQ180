import ReturnToMenuButton from "./ReturnToMenuButton";

function SelectRoom ({
    userName,
    handleRoomSelection,
    privateRoomCode,
    setPrivateRoomCode,
    selectedRoom,
    goToPage
}) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h1>Welcome {userName}!</h1>
                <h2>Select a Room</h2>
                <button onClick={() => handleRoomSelection('Room 1')}>Room 1</button>
                <button onClick={() => handleRoomSelection('Room 2')}>Room 2</button>
                <button onClick={() => handleRoomSelection('Room 3')}>Room 3</button>
                <h2>or enter a Private Room Code</h2>
                <input
                    type="text"
                    value={privateRoomCode}
                    onChange={(e) => setPrivateRoomCode(e.target.value)}
                    placeholder="Your Code"
                    className='input'
                />
                <button onClick={() => handleRoomSelection(privateRoomCode)}>Submit</button>
                {selectedRoom != null && (
                    <p>Waiting for server</p>
                )}
                <ReturnToMenuButton onClick={() => {
                    goToPage("Menu");
                }} />
            </div>
        </div>
    )
}

export default SelectRoom;