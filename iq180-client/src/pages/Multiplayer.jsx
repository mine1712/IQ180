import { useState, useEffect } from 'react';
// import '../css/Multiplayer.css';
import io from 'socket.io-client';

const server = io.connect('http://localhost:5172');

function Multiplayer () {
    return (
        <div>
            <h1>Target = XX</h1>
            <p>Time remaining = XX</p>
            <p>It is your turn</p>
            <div>
                {[...Array(5).keys()].map((index) => (
                    <span
                        key={'playSlot'+(index+1)}
                        // disabled={isTimeUp}
                        // draggable
                        // onDragStart={() => handleNumberDragStart(index)}
                        // onDrop={() => handleNumberDrop(index)}
                        // onDragOver={(e) => e.preventDefault()}
                        // id = "span_num_ops"
                    >
                        {'playSlot'+(index+1)}
                    </span>
                ))}
            </div>
            <div>
                {[1,3,5,7,9].map((number, index) => (
                    <span
                        key={'numberBank'+(index+1)}
                        // disabled={isTimeUp}
                        // draggable
                        // onDragStart={() => handleNumberDragStart(index)}
                        // onDrop={() => handleNumberDrop(index)}
                        // onDragOver={(e) => e.preventDefault()}
                        // id = "span_num_ops"
                    >
                        {'numberBank'+(index+1)+'='+(number)}
                    </span>
                ))}
            </div>
            <div>
                {['+','-','x','÷'].map((symbol, index) => (
                    <span
                        key={'operatorBank'+(index+1)}
                    >
                        {'operatorBank'+(index+1)+'='+(symbol)}
                    </span>

                ))}
            </div>
        </div>
    )
}

export default Multiplayer;