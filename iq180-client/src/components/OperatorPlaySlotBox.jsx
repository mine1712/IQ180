function OperatorPlaySlotBox({operator,index,dropHandler}) {
    
    const operatorPlaySlotDrop = (index) => {
        dropHandler("opslot",index);
    }
    
    return(
        <span
            // key={'numberPlaySlot'+(index+1)}
            id='operatorPlaySlotBox'
            // disabled={isTimeUp}
            // draggable
            // onDragStart={() => handleNumberDragStart(index)}
            onDrop={() => operatorPlaySlotDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            // id = "span_num_ops"
        >
            {operator}
        </span>
        
    );
}

export default OperatorPlaySlotBox;