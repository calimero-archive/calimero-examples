import { useEffect, useState } from "react";
import Square from "./Square";
import { post } from "../utils/request";

interface IProps {
  gameId: string;
  setGameId: (gameId: string) => void;
}

export default function Board({ gameId, setGameId }: IProps) {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<string>("");
  const [ended, setEnded] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<string>(
    "igi.hackathon.calimero.testnet"
  );
  // const [gameId, setGameId] = useState<string>("");
  const [color, setColor] = useState<string>("bg-white");

  const setBoard = async () => {
    const data = {
      player: currentPlayer,
      gameId: gameId,
    };
    const res = await post("/api/methods/getGame", data);
    if (res.success) {
      console.log(res);
      let defaultArray = [];
      setSquares(defaultArray);
      let newBoard = res.board.board[0].concat(
        res.board.board[1],
        res.board.board[2]
      );
      setSquares(newBoard);

      if (res.board.player_a_turn) {
        setColor("hover:bg-red-300");
        let currentPlayer = res.board.player_a;
        setCurrentPlayer(currentPlayer);
      } else {
        let currentPlayer = res.board.player_b;
        setColor("hover:bg-green-300");
        setCurrentPlayer(currentPlayer);
      }
      setEnded(res.board.status);
      if (res.board.status !== "InProgress") {
        switch (res.board.status) {
          case "PlayerAWon":
            setWinner(res.board.player_a);
            break;
          case "PlayerBWon":
            setWinner(res.board.player_b);
            break;
          default:
            setWinner("tie");
            break;
        }
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("gameId") || gameId) {
      if (gameId) {
        setBoard();
      }
    }
  }, [gameId]);

  const makeMove = async (index) => {
    if (currentPlayer && gameId) {
      const data = {
        player: currentPlayer,
        field: index,
        gameId: gameId,
      };
      const res = await post("/api/methods/makeMove", data);
      console.log(res);
      if (res.success) {
        setBoard();
      }
    }
  };
  return (
    <>
      <div className="flex justify-center text-lg font-bold ">
        Calimero X NEAR <br />
      </div>
      {winner === "tie" && (
        <div className="mt-2 text-yellow-700">Nobody won , tie !</div>
      )}
      {winner && (
        <div className="mt-2">
          Winner is: <span className="text-green-400">{winner}</span>
        </div>
      )}
      <>
        {!winner && (
          <>
            {gameId && (
              <div className="mt-4">
                GAME ID: <span>{gameId}</span>
              </div>
            )}
            <div className="mt-4">
              Player <span className="text-green-700">{currentPlayer}</span> is
              playing
            </div>
          </>
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
                  color={color}
                  onClick={() => makeMove(i)}
                  value={squares[i]}
                />
              );
            })}
        </div>
      </>
    </>
  );
}
