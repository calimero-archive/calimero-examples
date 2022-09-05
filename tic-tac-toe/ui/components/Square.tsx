export default function Square({
  value,
  onClick,
  currentPlayer,
  ended,
}: {
  currentPlayer: string;
  value: string;
  onClick: () => void;
  ended: boolean;
}) {
  if (!value) {
    return (
      <div className=" text-black">
        <button
          className={`${
            ended ? "bg-gray-600" : "bg-white"
          } flex items-center justify-center w-full h-24
          ${
            currentPlayer === "O" && !ended
              ? "hover:bg-green-300 transition-colors duration-100"
              : "hover:bg-red-300 transition-colors duration-100"
          } `}
          onClick={onClick}
          disabled={ended}
        >
          {value}
        </button>
      </div>
    );
  }
  return (
    <div className="text-black">
      <button
        className={`${
          value === "O" ? "bg-green-300" : "bg-red-300"
        } flex items-center justify-center w-full h-24 transition-colors duration-100 font-black text-6xl`}
        disabled={true}
      >
        {value}
      </button>
    </div>
  );
}
