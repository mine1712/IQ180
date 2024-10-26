import { useState, useEffect, Fragment } from "react";
import NumberPlaySlotBox from "./numberPlaySlotBox";
import OperatorPlaySlotBox from "./OperatorPlaySlotBox";
import NumberBankBox from "./NumberBankBox";
import OperatorBankBox from "./OperatorBankBox";
import "../css/GameArea.css";

function GameArea({
  playSlotNumbers,
  playSlotOperators,
  bankNumbers,
  bankOperators,
  setPlaySlotNumbers,
  setPlaySlotOperators,
  setBankNumbers,
  isTimeUp,
  handleSubmission,
  isYourTurn,
}) {
  const [currentDragItem, setCurrentDragItem] = useState(null);
  const [playSlotValues, setPlaySlotValues] = useState(
    Array(playSlotNumbers.length + playSlotOperators.length).fill()
  );

  useEffect(() => {
    let values = [];
    for (let i = 0; i < playSlotNumbers.length; i++) {
      if (i == playSlotNumbers.length - 1) {
        values = [...values, playSlotNumbers[i]];
      } else {
        values = [...values, playSlotNumbers[i], playSlotOperators[i]];
      }
    }
    setPlaySlotValues(values);
    // alert(playSlotNumbers);
    // alert(playSlotOperators);
  }, [playSlotNumbers, playSlotOperators]);

  const dragStartHandler = (dragSource, index) => {
    setCurrentDragItem({
      dragSource: dragSource,
      index: index,
    });
  };

  const dropHandler = (dropSource, index) => {
    if (dropSource == "opslot") {
      if (currentDragItem.dragSource == "opbank") {
        const newPlaySlotOperators = [...playSlotOperators];
        newPlaySlotOperators.splice(
          index,
          1,
          bankOperators[currentDragItem.index]
        );
        setPlaySlotOperators(newPlaySlotOperators);
      }
      if (currentDragItem.dragSource == "opslot") {
        const newPlaySlotOperators = [...playSlotOperators];
        const [replacedOperator] = newPlaySlotOperators.splice(
          index,
          1,
          playSlotOperators[currentDragItem.index]
        );
        newPlaySlotOperators.splice(currentDragItem.index, 1, replacedOperator);
        setPlaySlotOperators(newPlaySlotOperators);
      }
    }
    if (dropSource == "numslot") {
      if (
        currentDragItem.dragSource == "numbank" &&
        bankNumbers[currentDragItem.index] != null
      ) {
        const newPlaySlotNumbers = [...playSlotNumbers];
        newPlaySlotNumbers.splice(index, 1, bankNumbers[currentDragItem.index]);
        const newBankNumbers = [...bankNumbers];
        newBankNumbers.splice(currentDragItem.index, 1, playSlotNumbers[index]);
        setPlaySlotNumbers(newPlaySlotNumbers);
        setBankNumbers(newBankNumbers);
      }
      if (
        currentDragItem.dragSource == "numslot" &&
        playSlotNumbers[currentDragItem.index] != null
      ) {
        const newPlaySlotNumbers = [...playSlotNumbers];
        const [replacedNumber] = newPlaySlotNumbers.splice(
          index,
          1,
          playSlotNumbers[currentDragItem.index]
        );
        newPlaySlotNumbers.splice(currentDragItem.index, 1, replacedNumber);
        setPlaySlotNumbers(newPlaySlotNumbers);
      }
    }
    if (dropSource == "numbank") {
      if (
        currentDragItem.dragSource == "numslot" &&
        playSlotNumbers[currentDragItem.index] != null
      ) {
        const newBankNumbers = [...bankNumbers];
        newBankNumbers.splice(index, 1, playSlotNumbers[currentDragItem.index]);
        const newPlaySlotNumbers = [...playSlotNumbers];
        newPlaySlotNumbers.splice(currentDragItem.index, 1, bankNumbers[index]);
        setBankNumbers(newBankNumbers);
        setPlaySlotNumbers(newPlaySlotNumbers);
      }
      if (
        currentDragItem.dragSource == "numbank" &&
        bankNumbers[currentDragItem.index] != null
      ) {
        const newBankNumbers = [...bankNumbers];
        const [replacedNumber] = newBankNumbers.splice(
          index,
          1,
          bankNumbers[currentDragItem.index]
        );
        newBankNumbers.splice(currentDragItem.index, 1, replacedNumber);
        setBankNumbers(newBankNumbers);
      }
    }
    setCurrentDragItem(null);
  };

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
    // alert(formatOperators)
    return formatOperators;
  };

  // const playSlotValues = () => {
  //     let values=[]
  //     for (let i=0;i<playSlotNumbers.length;i++) {
  //         if (i==4) {
  //             values=[...values,playSlotNumbers[i]];
  //         } else {
  //             values=[...values,playSlotNumbers[i],playSlotOperators[i]];
  //         }
  //     }
  // }

  return (
    <div className="gamearea-container">
      <div className="playslot-container">
        {playSlotValues.map((number, index) => {
          if (index % 2 == 0) {
            return (
              <Fragment key={"numberPlaySlot" + (index / 2 + 1)}>
                <NumberPlaySlotBox
                  number={number}
                  index={index / 2}
                  dropHandler={dropHandler}
                  dragStartHandler={dragStartHandler}
                />
              </Fragment>
            );
            // if (index==playSlotValues.length-1) {
            //     return (
            //         <Fragment key={'numberPlaySlot'+((index/2)+1)}>
            //             <NumberPlaySlotBox number={number}
            //                 index={index/2}
            //                 dropHandler={dropHandler}
            //                 dragStartHandler={dragStartHandler}
            //             />
            //         </Fragment>
            //     )
            // } else return (
            //     <Fragment key={'numberPlaySlot'+((index/2)+1)}>
            //         <NumberPlaySlotBox number={number}
            //             index={index/2}
            //             dropHandler={dropHandler}
            //             dragStartHandler={dragStartHandler}
            //         />

            //     </Fragment>
            // )
          } else
            return (
              <Fragment key={"operatorPlaySlot" + (index + 1)}>
                <OperatorPlaySlotBox
                  operator={playSlotOperators[(index - 1) / 2]}
                  index={(index - 1) / 2}
                  dropHandler={dropHandler}
                  dragStartHandler={dragStartHandler}
                />
              </Fragment>
            );
        })}
        {/* BELOW IS OLD CODE THAT CAUSES "CHILD IN LIST NEEDS UNIQUE 'KEY' PROP WARNING"*/}
        {/* {playSlotNumbers.map((number,index) => {
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
                })} */}
      </div>
      <span className="number-text-design">number</span>
      <div className="number-container">
        {bankNumbers.map((number, index) => (
          <Fragment key={"numberBank" + (index + 1)}>
            <NumberBankBox
              number={number}
              index={index}
              dragStartHandler={dragStartHandler}
              dropHandler={dropHandler}
            />
          </Fragment>
        ))}
      </div>
      <span className="number-text-design">operator</span>
      <div className="operator-container">
        {bankOperators.map((symbol, index) => (
          <Fragment key={"numberBank" + (index + 1)}>
            <OperatorBankBox
              symbol={symbol}
              index={index}
              dragStartHandler={dragStartHandler}
            />
          </Fragment>
        ))}
      </div>
      <button
        className="singleplayer-checkans-button"
        onClick={() => {
          handleSubmission(playSlotNumbers, formatSubmission());
        }}
        disabled={isTimeUp || !isYourTurn}
      >
        Check answer
      </button>
      {/* <button onClick={() => {
                alert(isTimeUp + " " + isYourTurn);
            }} >Test</button> */}
    </div>
  );
}

export default GameArea;
