import { useState, useEffect } from 'react'
import '../css/Leaderboard.css';
import { server } from '../socket'


const Leaderboard = ({ onClose }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        server.emit("fetchLeaderBoard");
    }, [])

    useEffect(() => {
        function onLeaderBoard(sortedStats) {
            // alert(sortedStats);
            setData(sortedStats);
        }

        server.on("leaderBoard", onLeaderBoard);

        return () => {
            server.off("leaderBoard", onLeaderBoard);
        }
    }, [])

    return (
        <div className="leaderboard-modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Leaderboard</h2>
                {!data ||
                    Object.keys(data).length < 1 ? null : (
                    <div>
                        <p>
                            {Object.keys(data).map((key) => (
                                <div key={key}>
                                    <span>
                                        {JSON.stringify(data[key]["nickname"]).slice(
                                            1,
                                            -1
                                        )}
                                        :{" "}
                                    </span>
                                    <span>{JSON.stringify(data[key]["score"])}</span>
                                </div>
                            ))}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
