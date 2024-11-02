import ReturnToMenuButton from "./ReturnToMenuButton";

function RoomReady({
    handleEnterOptions,
    handleReady,
    isReady,
    waitOptions,
    server,
    goToPage
}) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Choose your options or ready up!</h2>
                <button onClick={handleEnterOptions}>Option</button>
                <button onClick={handleReady}
                    disabled={isReady}>Ready</button>
                <div>
                    {waitOptions && (
                        <p>Waiting for server</p>
                    )}
                </div>
                <ReturnToMenuButton onClick={() => {
                    server.emit('exitRoom');
                    goToPage("Menu");
                }} />
            </div>
        </div>
    )
}

export default RoomReady;