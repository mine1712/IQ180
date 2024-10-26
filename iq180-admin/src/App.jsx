import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [data, setData] = useState({ connections: {}, keys: {}, stats: {}, answers:{} });

  // getting connection data from the server
  const fetchConnection = async () => {
    const response = await fetch("./connections");
    const data = await response.json();
    setData((prev) => ({ ...prev, connections: data }));
  };

  //getting keys data from the server
  const fetchKeys = async () => {
    const response = await fetch("./keys");
    const data = await response.json();
    setData((prev) => ({ ...prev, keys: data }));
  };

  //getting stats data from the server
  const fetchStats = async () => {
    const response = await fetch("./stats");
    const data = await response.json();
    setData((prev) => ({ ...prev, stats: data }));
  };

  //getting answers data from the server
  const fetchAns = async () => {
    const response = await fetch("./answers");
    const data = await response.json();
    setData((prev) => ({ ...prev, answers: data }));
  };

  function getData() {
    fetchConnection();
    fetchKeys();
    fetchStats();
    fetchAns();
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div className="concurrent-connections">
        <span>
          Number of connected users: {Object.keys(data.connections).length}
        </span>
      </div>
      <div className="reset-server">
        <button
          onClick={async () => {
            let response;
            try {
              response = await fetch("./reset", {
                method: "GET",
              });
            } catch (err) {
              console.log(err);
            }
            if (response.ok) {
              alert("Server reset successfully");
            }
          }}
        >
          resetServer
        </button>
      </div>
      <div className="leaderboard">
        {!data ||
        !data["stats"] ||
        Object.keys(data.stats).length < 1 ? null : (
          <div>
            <h2>Score board</h2>{" "}
            <p>
              {Object.keys(data["stats"]).map((key) => (
                <div key={key}>
                  <span>
                    {JSON.stringify(data["stats"][key]["nickname"]).slice(
                      1,
                      -1
                    )}
                    :{" "}
                  </span>
                  <span>{JSON.stringify(data["stats"][key]["score"])}</span>
                </div>
              ))}
            </p>
          </div>
        )}
      </div>
      <div className="Room">
        {!data || !data["keys"] || Object.keys(data.keys).length < 1 ? null : (
          <div>
            <span>
              {Object.keys(data.keys).map((key) => (
                <div key={key}>
                  <span>{key}:&nbsp;&nbsp;</span>
                  <span>
                    {data["keys"][key]["users"].length === 2 ? (
                      <span>
                        {data["keys"][key]["users"][0]}&nbsp;,&nbsp;
                        {data["keys"][key]["users"][1]}{" "}
                      </span>
                    ) : (
                      <span>{data["keys"][key]["users"][0]}</span>
                    )}
                    {data && data["answers"] && data["answers"][key]? (<span><br/>answer: {JSON.stringify(data["answers"][key]).slice(1,-1)}</span>):null}
                  </span>

                  <div>
                    <button
                      onClick={async () => {
                        let response;
                        try {
                          response = await fetch(
                            "./resetRoom",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ room: key }), // Correctly formatted JSON
                            }
                          );
                        } catch (err) {
                          console.log(err);
                        }
                        if (response.ok) {
                          alert(key + " reset successfully");
                        } else {
                          alert("Failed to reset " + key);
                        }
                      }}
                    >
                      reset {key}
                    </button>
                  </div>
                </div>
              ))}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
