function NumberBankBox({
    number,
    index,
    dragStartHandler,
    dropHandler,
    onClick,
}) {
    const numberBankBoxDragStart = (index) => {
        dragStartHandler("numbank", index);
    };

    const numberBankBoxDrop = (index) => {
        dropHandler("numbank", index);
    };

    return (
        <span
            style={{
                backgroundColor: "#4AC29A",
                width: 50,
                aspectRatio: 1,
                borderRadius: 50,
                textAlign: "center",
                color: "white",
                fontSize: 40,
                boxShadow: "0px 25px 10px -16px rgba(0,0,0,0.1)",
            }}
            key={"numberBank" + (index + 1)}
            id="numberBankBox"
            // disabled={isTimeUp}
            draggable={true}
            onDragStart={() => numberBankBoxDragStart(index)}
            onDrop={() => numberBankBoxDrop(index)}
            onDragOver={(e) => e.preventDefault()}
            onClick={onClick}
            // id = "span_num_ops"
        >
            {number}
        </span>
    );
}

export default NumberBankBox;
