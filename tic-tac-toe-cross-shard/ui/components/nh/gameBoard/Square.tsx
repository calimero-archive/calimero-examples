import { useState } from "react";

export default function Square({
  value,
  onClick,
  color,
  ended,
  playerTurn,
  playerA,
}: {
  value: string;
  onClick: () => void;
  color: string;
  ended: string;
  playerTurn: string;
  playerA: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
      <div
        className="text-white"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`${
            ended !== "InProgress" ? "bg-nh-table-container" : "bg-nh-badge-bg"
          } flex items-center justify-center w-32 h-32 rounded-lg font-black text-6xl
          ${localStorage.getItem("calimeroAccountId") === playerTurn && color}`}
          onClick={onClick}
          disabled={ended === "InProgress" ? false : true}
        >
          {(isHovered && localStorage.getItem("calimeroAccountId")) ===
          playerTurn
            ? playerTurn === playerA
              ? "O"
              : "X"
            : ""}
        </button>
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
