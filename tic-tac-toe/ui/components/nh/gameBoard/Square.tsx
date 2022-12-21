export default function Square({
  value,
  onClick,
  color,
  ended,
}: {
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
      return "bg-nh-testnet";
    } else {
      return "bg-nh-badge-bg";
    }
  };
  if (value === "U") {
    return (
      <div className="text-white">
        <button
          className={`${
            ended !== "InProgress" ? "bg-nh-table-container" : "bg-nh-badge-bg"
          } flex items-center justify-center w-32 h-32 rounded-lg
          ${color}`}
          onClick={onClick}
          disabled={ended === "InProgress" ? false : true}
        ></button>
      </div>
    );
  }
  return (
    <div className="text-white">
      <button
        className={`${getColor(
          value
        )} flex items-center justify-center w-32 h-32 transition-colors duration-100 font-black text-6xl rounded-lg`}
        disabled={true}
      >
        {value}
      </button>
    </div>
  );
}
