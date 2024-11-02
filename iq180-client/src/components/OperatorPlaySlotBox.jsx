function OperatorPlaySlotBox({ operator, index, dropHandler, dragStartHandler, onClick }) {

    const operatorPlaySlotDragStart = (index) => {
        dragStartHandler("opslot", index)
    }

    const operatorPlaySlotDrop = (index) => {
        dropHandler("opslot", index);
    }

    return (
        <span
            key={'operatorPlaySlot' + (index + 1)}
            id='operatorPlaySlotBox'
            // disabled={isTimeUp}
            draggable={true}
            onDragStart={() => operatorPlaySlotDragStart(index)}
            onDrop={() => operatorPlaySlotDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            // id = "span_num_ops"
            onClick={onClick}
        >
            {operator}
        </span>

    );
}

export default OperatorPlaySlotBox;