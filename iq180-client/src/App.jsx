import { useState } from 'react'
// import './App.css'
import {Menu,Singleplayer,Multiplayer} from './pages'

function App() {
  const [currentPage, setCurrentPage] = useState("Menu");
  return (
    <>
      {currentPage=="Menu" && (
        <Menu goToPage={setCurrentPage}/>
      )}
      {currentPage=="Singleplayer"&& (
        <Singleplayer goToPage={setCurrentPage}/>
      )}
      {currentPage=="Multiplayer"&& (
        <Multiplayer goToPage={setCurrentPage}/>
      )}
    </>
  )
}

export default App
