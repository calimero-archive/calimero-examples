import { useEffect, useState } from "react";
import Square from "./Square";

export default function Board() {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<string>("");
  const [ended, setEnded] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  function setSquareValue(index: number) {
    const newData = squares.map((val, i) => {
      if (i === index) {
        return currentPlayer;
      }
      return val;
    });
    setSquares(newData);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }
  function calculateWinner(squares: string[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return "";
  }
  useEffect(() => {
    setCurrentPlayer(Math.round(Math.random() * 1) === 1 ? "X" : "O");
    setEnded(false);
    setWinner("");
  }, []);
  useEffect(() => {
    const w = calculateWinner(squares);
    if (w) {
      setWinner(w);
      setEnded(true);
    }
    if (!w && !squares.filter((square) => !square).length) {
      setWinner("tie");
    }
  }, [squares]);
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setWinner("");
    setCurrentPlayer(Math.round(Math.random() * 1) === 1 ? "X" : "O");
    setEnded(false);
  };
  return (
    <>
      <div className="flex justify-center text-lg font-bold ">
        Calimero X NEAR <br />
      </div>
      {winner && (
        <div className="mt-2 text-xl font-bold text-green-400">
          Winner is <span>{winner}</span>
        </div>
      )}
      <>
        {!winner && (
          <div className="mt-4">
            Player <span>{currentPlayer}</span> is playing
          </div>
        )}
        <div className="bg-black px-4 mt-6 py-4 grid grid-cols-3 gap-x-4 gap-y-4">
          {Array(9)
            .fill(null)
            .map((_, i) => {
              return (
                <Square
                  key={i}
                  ended={ended}
                  currentPlayer={currentPlayer}
                  onClick={() => setSquareValue(i)}
                  value={squares[i]}
                />
              );
            })}
        </div>
        <div>
          <button
            className={`${
              ended
                ? "bg-white hover:bg-gray-50 text-black"
                : "bg-gray-800 text-white hover:bg-gray-800"
            } shadow-md mt-8 rounded-lg px-8 py-4 hover:bg-gray-50 w-full`}
            disabled={!ended}
            onClick={() => resetGame()}
          >
            Play Again!
          </button>
        </div>
      </>
    </>
  );
}
