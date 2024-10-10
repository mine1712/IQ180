import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
