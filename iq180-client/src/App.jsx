import { useState, useEffect } from 'react'
// import './App.css'
import { Menu, Singleplayer, Multiplayer } from './pages'
import { server } from './socket'

function App() {
    const [currentPage, setCurrentPage] = useState("Menu");

    useEffect(() => {
        function onServerReset() {
            if (currentPage == "Multiplayer") {
                alert("The server has been reset!\nReturning to Menu")
                setCurrentPage("Menu")
            }
        }
        server.on("serverReset", onServerReset)

        return () => {
            server.off("serverReset", onServerReset)
        }
    }, [currentPage])

    useEffect(() => {
        function onDisconnect(reason) {
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                server.connect();
            }
            if (reason === "transport error") {
                if (currentPage == "Multiplayer") {
                    alert("The server has been turned off!\nReturning to Menu")
                    setCurrentPage("Menu")
                }
            }
            if (reason === "ping timeout") {
                if (currentPage == "Multiplayer") {
                    alert("Ping timed out!\nReturning to Menu")
                    setCurrentPage("Menu")
                }
            }
            if (reason === "transport close") {
                if (currentPage == "Multiplayer") {
                    alert("You have lost connection!\nReturning to Menu")
                    setCurrentPage("Menu")
                }
            }
        }
        server.on("disconnect", onDisconnect)

        return () => {
            server.off("disconnect", onDisconnect)
        }
    }, [])

    return (
        <>
            {currentPage == "Menu" && (
                <Menu goToPage={setCurrentPage} />
            )}
            {currentPage == "Singleplayer" && (
                <Singleplayer goToPage={setCurrentPage} />
            )}
            {currentPage == "Multiplayer" && (
                <Multiplayer goToPage={setCurrentPage} />
            )}
        </>
    )
}

export default App
