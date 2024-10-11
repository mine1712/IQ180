// function numberBankBoxDragStart(index) {

// }

function NumberBankBox({number,index,dragStartHandler}) {

    const numberBankBoxDragStart = (index) => {
        dragStartHandler("numbank",index)
    }

    return (
        <span
            key={'numberBank'+(index+1)}
            id = 'numberBankBox'
            // disabled={isTimeUp}
            draggable={true}
            onDragStart={() => numberBankBoxDragStart(index)}
            // onDrop=
            // onDragOver={(e) => e.preventDefault()}
            // id = "span_num_ops"
        >
            {number}
        </span>
    )
}

export default NumberBankBox