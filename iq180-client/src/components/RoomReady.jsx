import ReturnToMenuButton from "./ReturnToMenuButton";

function RoomReady({
    handleEnterOptions,
    handleReady,
    isReady,
    waitOptions,
    server,
    goToPage,
}) {
    return (
        <div className="form-container">
            <div className="multiplayer-welcome-container">
                <div className="set-welcome-text">
                    Choose your options or ready up!
                </div>
                <div className="input-container">
                    <button
                        className="set-room-button"
                        onClick={handleEnterOptions}
                    >
                        Option
                    </button>
                    <button
                        className="set-room-button"
                        onClick={handleReady}
                        disabled={isReady}
                    >
                        Ready
                    </button>
                </div>
                <div>{waitOptions && <p>Waiting for server</p>}</div>
                <ReturnToMenuButton
                    onClick={() => {
                        server.emit("exitRoom");
                        goToPage("Menu");
                    }}
                />
            </div>
        </div>
    );
}

export default RoomReady;
