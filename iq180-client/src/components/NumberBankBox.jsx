function NumberBankBox({number,index,dragStartHandler,dropHandler}) {

    const numberBankBoxDragStart = (index) => {
        dragStartHandler("numbank",index);
    }

    const numberBankBoxDrop = (index) => {
        dropHandler("numbank",index);
    }

    return (
        <span
            key={'numberBank'+(index+1)}
            id = 'numberBankBox'
            // disabled={isTimeUp}
            draggable={true}
            onDragStart={() => numberBankBoxDragStart(index)}
            onDrop={() => numberBankBoxDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            // id = "span_num_ops"
        >
            {number}
        </span>
    )
}

export default NumberBankBox