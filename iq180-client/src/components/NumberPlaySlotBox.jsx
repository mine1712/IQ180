// import '../css/Multiplayer.css'



function NumberPlaySlotBox({number,index,dropHandler,dragStartHandler}) {

    const numberPlaySlotDrop = (index) => {
        dropHandler("numslot",index);
    }

    const numberPlaySlotDragStart = (index) => {
        dragStartHandler("numslot",index);
    }

    return(
        <span
            key={'numberPlaySlot'+(index+1)}
            id='numberPlaySlotBox'
            // disabled={isTimeUp}
            draggable={true}
            onDragStart={() => numberPlaySlotDragStart(index)}
            onDrop={() => numberPlaySlotDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            // id = "span_num_ops"
        >
            {number}
        </span>
        
    );
}

export default NumberPlaySlotBox;