function OperatorBankBox({ symbol, index, dragStartHandler, onClick }) {
    const operatorBankBoxDragStart = (index) => {
        dragStartHandler("opbank", index)
    }

    return (
        <span
            key={'operatorBank' + (index + 1)}
            id='operatorBankBox'
            draggable={true}
            onDragStart={() => operatorBankBoxDragStart(index)}
            onClick={onClick}
        >
            {symbol}
        </span>
    )
}

export default OperatorBankBox;