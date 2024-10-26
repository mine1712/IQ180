import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

function App() {
  const [data,setData] = useState({ connections:{}, keys:{}, stats:{} });

  // getting connection data from the server
  const fetchConnection = async () => {
    const response = await fetch('http://localhost:5172/connections');
    const data = await response.json();
    setData(prev => ({...prev, connections:data}));
  }
  
  //getting keys data from the server
  const fetchKeys = async () => {
    const response = await fetch('http://localhost:5172/keys');
    const data = await response.json();
    setData(prev => ({...prev, keys:data}));
  }

  //getting stats data from the server
  const fetchStats = async () => {
    const response = await fetch('http://localhost:5172/stats');
    const data = await response.json();
    setData(prev => ({...prev, stats:data}));
  }

  function getData() {
    fetchConnection();
    fetchKeys();
    fetchStats();
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      getData()},1000);
      return () => {
        clearInterval(intervalId);
      };
    },[]);



  return (
    <>
      <div className='concurrent-connections'>
        <span>Number of connected users: {Object.keys(data.connections).length}</span>
      </div>
      <div className='reset-server'>
        <button onClick={async() => {
          let response;
          try{
            response = await fetch('http://localhost:5172/reset',{method: 'GET'});
          }
          catch(err){
            console.log(err);
          }
          if(response.ok){
            alert("Server reset successfully");
          }
        }}>resetServer</button>
      </div>
      <div className='leaderboard'>
        
        {((!data || !data["stats"]) || Object.keys(data.stats).length < 1) ? null:  <div><h2>Score board</h2> <p>
          {Object.keys(data["stats"]).map((key) => (
            <div key={key}>
              <span>{JSON.stringify(data["stats"][key]['nickname']).slice(1,-1)}: </span>
              <span>{JSON.stringify(data["stats"][key]['score'])}</span>
            </div>
      ))}
    </p>
    </div>}
      </div>
    </>
  )
}

export default App
