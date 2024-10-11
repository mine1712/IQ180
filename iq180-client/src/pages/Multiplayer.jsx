import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
import io from 'socket.io-client';
import {GameArea} from '../components';

const server = io.connect('http://localhost:5172');

function Multiplayer () {
    const [playSlotNumbers,setPlaySlotNumbers] = useState(Array(5).fill());
    const [playSlotOperators,setPlaySlotOperators] = useState(Array(4).fill());
    const [bankNumbers,setBankNumbers] = useState([1,3,5,7,9])
    const [bankOperators,setBankOperators] = useState(['+','-','x','÷'])
    // const numbers = [null,2,3,4,5]
    // setPlaySlotNumbers([null,2,3,4,5])
    // const operators = ['+','-','x','÷']
    return (
        <div>
            <h1>Target = XX</h1>
            <p>Time remaining = XX</p>
            <p>It is your turn</p>
            <GameArea playSlotNumbers={playSlotNumbers}
                playSlotOperators={playSlotOperators}
                bankNumbers={bankNumbers}
                bankOperators={bankOperators}
                setPlaySlotNumbers={setPlaySlotNumbers}
                setPlaySlotOperators={setPlaySlotOperators}
                setBankNumbers={setBankNumbers}
            />
        </div>    
    )
}

export default Multiplayer;