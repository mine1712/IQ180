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
