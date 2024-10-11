// function numberBankBoxDragStart(index) {

// }

function NumberBankBox({number,index}) {
    return (
        <span
            // key={'numberBank'+(index+1)}
            id = 'numberBankBox'
            // disabled={isTimeUp}
            // draggable
            // onDragStart={() => numberBankBoxDragStart(index)}
            // onDrop={() => handleNumberDrop(index)}
            // onDragOver={(e) => e.preventDefault()}
            // id = "span_num_ops"
        >
            {number}
        </span>
    )
}

export default NumberBankBox