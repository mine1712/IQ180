function OperatorBankBox({symbol,index,dragStartHandler}) {
    const operatorBankBoxDragStart = (index) => {
        dragStartHandler("opbank",index)
    }

    return(
        <span
            key={'operatorBank'+(index+1)}
            id = 'operatorBankBox'
            draggable={true}
            onDragStart={() => operatorBankBoxDragStart(index)}
        >
            {symbol}
        </span>
    )
}

export default OperatorBankBox;