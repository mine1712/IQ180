function OperatorBankBox({ symbol, index, dragStartHandler, onClick }) {
    const operatorBankBoxDragStart = (index) => {
        dragStartHandler("opbank", index);
    };

    return (
        <span
            style={{
                backgroundColor: "#4AC29A",
                textAlign: "center",
                color: "white",
            }}
            key={"operatorBank" + (index + 1)}
            id="operatorBankBox"
            draggable={true}
            onDragStart={() => operatorBankBoxDragStart(index)}
            onClick={onClick}
        >
            {symbol}
        </span>
    );
}

export default OperatorBankBox;
