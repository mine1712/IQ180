import NumberPlaySlotBox from "./numberPlaySlotBox";
import OperatorPlaySlotBox from "./OperatorPlaySlotBox";
import NumberBankBox from "./NumberBankBox";
import OperatorBankBox from "./OperatorBankBox";

function GameArea({
    playSlotNumbers,
    playSlotOperators,
    bankNumbers,
    bankOperators
}) {
    return (
        <div style={{textAlign:'center'}}>
            <div id="playSlotBoxArea">
                {playSlotNumbers.map((number,index) => {
                    // return <NumberPlaySlotBox/>
                    if (index==4) {
                        return (
                            <>
                                <NumberPlaySlotBox number={number}/>
                            </>
                        )
                    } else return (
                        <>
                            <NumberPlaySlotBox number={number}/>
                            <OperatorPlaySlotBox operator={playSlotOperators[index]}/>
                        </>
                    )
                })}
            </div>
            <div>
                {bankNumbers.map((number, index) => (
                    <NumberBankBox number={number} index={index}/>
                ))}
            </div>
            <div>
                {bankOperators.map((symbol, index) => (
                    <OperatorBankBox symbol={symbol} index={index}/>
                ))}
            </div>
        </div>
    );
}

export default GameArea;