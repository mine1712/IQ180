import { useState } from 'react'
// import './App.css'
import {Menu,Singleplayer,Multiplayertemp} from './pages'

function App() {
  const [currentPage, setCurrentPage] = useState("Menu");
  return (
    <>
      {currentPage=="Menu" && (
        <Menu goToPage={setCurrentPage}/>
      )}
      {currentPage=="Singleplayer"&& (
        <Singleplayer />
      )}
      {currentPage=="Multiplayer"&& (
        <Multiplayertemp />
      )}
    </>
  )
}

export default App
