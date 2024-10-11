import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
import io from 'socket.io-client';

const server = io.connect('http://localhost:5172');

function Multiplayer () {
    return (
        <div>
            <h1>Target = XX</h1>
            <p>Time remaining = XX</p>
            <p>It is your turn</p>
            <div style={{textAlign:'center'}}>
                <div>
                    {[...Array(5).keys()].map((index) => {
                        if (index==4) {
                            return (
                                <div id="playSlotBoxArea">
                                    <span
                                        key={'numberPlaySlot'+(index+1)}
                                        id='numberPlaySlotBox'
                                        // disabled={isTimeUp}
                                        // draggable
                                        // onDragStart={() => handleNumberDragStart(index)}
                                        // onDrop={() => handleNumberDrop(index)}
                                        // onDragOver={(e) => e.preventDefault()}
                                        // id = "span_num_ops"
                                    >
                                        1
                                    </span>
                                </div>
                            )
                        } else return (
                            <div id="playSlotBoxArea">
                                <span
                                    key={'numberPlaySlot'+(index+1)}
                                    id='numberPlaySlotBox'
                                    // disabled={isTimeUp}
                                    // draggable
                                    // onDragStart={() => handleNumberDragStart(index)}
                                    // onDrop={() => handleNumberDrop(index)}
                                    // onDragOver={(e) => e.preventDefault()}
                                    // id = "span_num_ops"
                                >
                                    1
                                </span>
                                <span
                                    key={'numberPlaySlot'+(index+1)}
                                    id='operatorPlaySlotBox'
                                    // disabled={isTimeUp}
                                    // draggable
                                    // onDragStart={() => handleNumberDragStart(index)}
                                    // onDrop={() => handleNumberDrop(index)}
                                    // onDragOver={(e) => e.preventDefault()}
                                    // id = "span_num_ops"
                                >
                                    +
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div>
                    {[1,3,5,7,9].map((number, index) => (
                        <span
                            key={'numberBank'+(index+1)}
                            id = 'numberBankBox'
                            // disabled={isTimeUp}
                            // draggable
                            // onDragStart={() => handleNumberDragStart(index)}
                            // onDrop={() => handleNumberDrop(index)}
                            // onDragOver={(e) => e.preventDefault()}
                            // id = "span_num_ops"
                        >
                            {number}
                        </span>
                    ))}
                </div>
                <div>
                    {['+','-','x','÷'].map((symbol, index) => (
                        <span
                            key={'operatorBank'+(index+1)}
                            id = 'operatorBankBox'
                        >
                            {symbol}
                        </span>

                    ))}
                </div>
            </div>
            
        </div>
    )
}

export default Multiplayer;