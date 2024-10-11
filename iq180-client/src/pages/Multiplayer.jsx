import { useState, useEffect } from 'react';
// import '../css/Multiplayer.css';
import io from 'socket.io-client';

const server = io.connect('http://localhost:5172');

function Multiplayer () {
    return (
        <div>
            <h1>Hello World!</h1>
        </div>
    )
}

export default Multiplayer;