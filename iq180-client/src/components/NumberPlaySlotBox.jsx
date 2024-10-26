// import '../css/Multiplayer.css'

function NumberPlaySlotBox({ number, index, dropHandler, dragStartHandler }) {
  const numberPlaySlotDrop = (index) => {
    dropHandler("numslot", index);
  };

  const numberPlaySlotDragStart = (index) => {
    dragStartHandler("numslot", index);
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
        boxShadow: "0px 25px 10px -16px rgba(0,0,0,0.1)",
      }}
      key={"numberPlaySlot" + (index + 1)}
      id="numberPlaySlotBox"
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
