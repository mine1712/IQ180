import { useState, useEffect } from 'react';
import NumberPlaySlotBox from "./numberPlaySlotBox";
import OperatorPlaySlotBox from "./OperatorPlaySlotBox";
import NumberBankBox from "./NumberBankBox";
import OperatorBankBox from "./OperatorBankBox";

function GameArea({
    playSlotNumbers,
    playSlotOperators,
    bankNumbers,
    bankOperators,
    setPlaySlotNumbers,
    setPlaySlotOperators,
    setBankNumbers
}) {

    const [currentDragItem, setCurrentDragItem] = useState(null)

    const dragStartHandler = (dragSource,index) => {
        setCurrentDragItem({
            "dragSource":dragSource,
            "index":index
        })
    }

    const dropHandler = (dropSource,index) => {
        if (dropSource=="opslot") {
            if (currentDragItem.dragSource=="opbank") {
                const newPlaySlotOperators = [...playSlotOperators];
                newPlaySlotOperators.splice(index,1,bankOperators[currentDragItem.index]);
                setPlaySlotOperators(newPlaySlotOperators);
            }
            
        }
        if (dropSource=="numslot") {
            if (currentDragItem.dragSource=="numbank" && bankNumbers[currentDragItem.index]!=null) {
                const newPlaySlotNumbers = [...playSlotNumbers];
                newPlaySlotNumbers.splice(index,1,bankNumbers[currentDragItem.index])
                setPlaySlotNumbers(newPlaySlotNumbers);
                const newBankNumbers = [...bankNumbers];
                newBankNumbers.splice(currentDragItem.index,1,null);
                setBankNumbers(newBankNumbers);
            }
            if (currentDragItem.dragSource=="numslot") {
                const newPlaySlotNumbers = [...playSlotNumbers];
                const [replacedNumber] = newPlaySlotNumbers.splice(index,1,playSlotNumbers[currentDragItem.index]);
                newPlaySlotNumbers.splice(currentDragItem.index,1,replacedNumber)
                setPlaySlotNumbers(newPlaySlotNumbers);
            }
        }
        setCurrentDragItem(null);
    }

    return (
        <div style={{textAlign:'center'}}>
            <div>
                {playSlotNumbers.map((number,index) => {
                    if (index==4) {
                        return (
                            <>
                                <NumberPlaySlotBox number={number}
                                    index={index}
                                    dropHandler={dropHandler}
                                    dragStartHandler={dragStartHandler}
                                />
                            </>
                        )
                    } else return (
                        <>
                            <NumberPlaySlotBox number={number}
                                index={index}
                                dropHandler={dropHandler}
                                dragStartHandler={dragStartHandler}
                            />
                            <OperatorPlaySlotBox operator={playSlotOperators[index]}
                                    index={index}  
                                    dropHandler={dropHandler} 
                            />
                        </>
                    )
                })}
            </div>
            <div>
                {bankNumbers.map((number, index) => (
                    <NumberBankBox number={number} index={index} dragStartHandler={dragStartHandler}/>
                ))}
            </div>
            <div>
                {bankOperators.map((symbol, index) => (
                    <OperatorBankBox symbol={symbol} index={index} dragStartHandler={dragStartHandler}/>
                ))}
            </div>
        </div>
    );
}

export default GameArea;