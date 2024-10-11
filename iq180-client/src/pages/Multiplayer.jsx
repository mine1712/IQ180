import { useState, useEffect } from 'react';
import '../css/Multiplayer.css';
import io from 'socket.io-client';
import {NumberPlaySlotBox,OperatorPlaySlotBox} from '../components';

const server = io.connect('http://localhost:5172');

function Multiplayer () {
    const numbers = [null,2,3,4,5]
    const operators = ['+','-','x','÷']
    return (
        <div>
            <h1>Target = XX</h1>
            <p>Time remaining = XX</p>
            <p>It is your turn</p>
            <div style={{textAlign:'center'}}>
                <div>
                    {numbers.map((number,index) => {
                        // return <NumberPlaySlotBox/>
                        if (index==4) {
                            return (
                                <div id="playSlotBoxArea">
                                    <NumberPlaySlotBox number={number}/>
                                </div>
                            )
                        } else return (
                            <div id="playSlotBoxArea">
                                <NumberPlaySlotBox number={number}/>
                                <OperatorPlaySlotBox operator={operators[index]}/>
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