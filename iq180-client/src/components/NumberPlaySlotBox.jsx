function NumberPlaySlotBox({number}) {
    return(
        <span
        // key={'numberPlaySlot'+(index+1)}
        id='numberPlaySlotBox'
        // disabled={isTimeUp}
        // draggable
        // onDragStart={() => handleNumberDragStart(index)}
        // onDrop={() => handleNumberDrop(index)}
        // onDragOver={(e) => e.preventDefault()}
        // id = "span_num_ops"
        >
            {number}
        </span>
        
    );
}

export default NumberPlaySlotBox;