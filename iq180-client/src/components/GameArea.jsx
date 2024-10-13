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
    setBankNumbers,
    isTimeUp,
    handleSubmission
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
            if (currentDragItem.dragSource=="opslot") {
                const newPlaySlotOperators = [...playSlotOperators];
                const [replacedOperator] = newPlaySlotOperators.splice(index,1,playSlotOperators[currentDragItem.index]);
                newPlaySlotOperators.splice(currentDragItem.index,1,replacedOperator);
                setPlaySlotOperators(newPlaySlotOperators);
            }
        }
        if (dropSource=="numslot") {
            if (currentDragItem.dragSource=="numbank" && bankNumbers[currentDragItem.index]!=null) {
                const newPlaySlotNumbers = [...playSlotNumbers];
                newPlaySlotNumbers.splice(index,1,bankNumbers[currentDragItem.index]);
                const newBankNumbers = [...bankNumbers];
                newBankNumbers.splice(currentDragItem.index,1,playSlotNumbers[index]);
                setPlaySlotNumbers(newPlaySlotNumbers);
                setBankNumbers(newBankNumbers);
            }
            if (currentDragItem.dragSource=="numslot" && playSlotNumbers[currentDragItem.index]!=null) {
                const newPlaySlotNumbers = [...playSlotNumbers];
                const [replacedNumber] = newPlaySlotNumbers.splice(index,1,playSlotNumbers[currentDragItem.index]);
                newPlaySlotNumbers.splice(currentDragItem.index,1,replacedNumber);
                setPlaySlotNumbers(newPlaySlotNumbers);
            }
        }
        if (dropSource=="numbank") {
            if (currentDragItem.dragSource=="numslot" && playSlotNumbers[currentDragItem.index]!=null) {
                const newBankNumbers = [...bankNumbers];
                newBankNumbers.splice(index,1,playSlotNumbers[currentDragItem.index]);
                const newPlaySlotNumbers = [...playSlotNumbers];
                newPlaySlotNumbers.splice(currentDragItem.index,1,bankNumbers[index]);
                setBankNumbers(newBankNumbers);
                setPlaySlotNumbers(newPlaySlotNumbers);
            }
            if (currentDragItem.dragSource=="numbank" && bankNumbers[currentDragItem.index]!=null) {
                const newBankNumbers = [...bankNumbers];
                const [replacedNumber] = newBankNumbers.splice(index,1,bankNumbers[currentDragItem.index]);
                newBankNumbers.splice(currentDragItem.index,1,replacedNumber);
                setBankNumbers(newBankNumbers);
            }
        }
        setCurrentDragItem(null);
    }

    const formatSubmission = () => {
        const formatOperators = playSlotOperators.reduce((acc, curr) => {
            if (curr === "x") {
                acc.push("*");
            } else if (curr === "÷") {
                acc.push("/");
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);
        alert(formatOperators)
        return formatOperators;
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
                                    dragStartHandler={dragStartHandler}
                            />
                        </>
                    )
                })}
            </div>
            <div>
                {bankNumbers.map((number, index) => (
                    <NumberBankBox number={number} index={index} dragStartHandler={dragStartHandler} dropHandler={dropHandler}/>
                ))}
            </div>
            <div>
                {bankOperators.map((symbol, index) => (
                    <OperatorBankBox symbol={symbol} index={index} dragStartHandler={dragStartHandler}/>
                ))}
            </div>
            <button onClick={() => {
                handleSubmission(playSlotNumbers,formatSubmission);
            }} disabled={isTimeUp} >Submit answer</button>
        </div>
    );
}

export default GameArea;