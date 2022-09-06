export default function Square({
  value,
  onClick,
  currentPlayer,
  color,
  ended,
}: {
  currentPlayer: string;
  value: string;
  onClick: () => void;
  color: string;
  ended: string;
}) {
  const getColor = (value) => {
    if (!value) {
      return "bg-white";
    }
    if (value === "X") {
      return "bg-green-300";
    } else {
      return "bg-red-400";
    }
  };
  if (value === "U") {
    return (
      <div className=" text-black">
        <button
          className={`${
            ended !== "InProgress" ? "bg-gray-600" : "bg-white"
          } flex items-center justify-center w-full h-24
          ${color}`}
          onClick={onClick}
          disabled={ended === "InProgress" ? false : true}
        ></button>
      </div>
    );
  }
  return (
    <div className="text-black">
      <button
        className={`${getColor(
          value
        )} flex items-center justify-center w-full h-24 transition-colors duration-100 font-black text-6xl`}
        disabled={true}
      >
        {value}
      </button>
    </div>
  );
}
