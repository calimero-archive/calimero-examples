import { useEffect, useState } from "react";
import Square from "./Square";
import { GameProps } from "./dashboard/OpenGameList";
import { makeMoveMethod } from "../utils/callMethods";

interface IProps {
  gameData: GameProps;
  gameId: number;
  getGame: () => void;
}

export default function Board({ gameData, gameId, getGame }: IProps) {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(null));
  const [ended, setEnded] = useState<string>("");
  const [color, setColor] = useState<string>("bg-white");
  const [loggedInPlayer, setLoggedInPlayer] = useState<string>("");

  useEffect(() => {
    let signedPlayer = localStorage.getItem("account_id");
    if (signedPlayer) {
      setLoggedInPlayer(signedPlayer);
    }
    setBoard();
  }, []);

  const setBoard = async () => {
    setSquares(gameData.boardStatus);
    if (gameData.playerA === gameData.playerTurn) {
      setColor("hover:bg-red-300");
    } else {
      setColor("hover:bg-green-300");
    }
    setEnded(gameData.status);
  };
  const makeMove = async (index: number) => {
    if (gameData.playerTurn === loggedInPlayer) {
      const methodProps = {
        boardIndex: index,
        gameId: gameId,
      };
      await makeMoveMethod(methodProps);
      getGame();
    }
  };
  return (
    <>
      <div className="px-10 py-10 flex justify-between gap-x-4">
        <div className="bg-black w-1/2 text-white rounded-md px-10 py-10">
          <p>
            Your account:
            <span className="text-violet-500 py-10">{loggedInPlayer}</span>
          </p>
          <p>
            Players: <span className="text-red-400">{gameData.playerA}</span> &{" "}
            <span className="text-green-400">{gameData.playerB}</span>
          </p>
          <p>
            Player Turn:
            <span
              className={`${
                gameData.playerTurn === gameData.playerA
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {gameData.playerTurn}
            </span>
          </p>
          <p>Game ID: {gameId}</p>
          {gameData.status === "PlayerAWon" && (
            <p className="pt-10 text-xl text-green-400">
              Winner: {gameData.playerA}
            </p>
          )}
          {gameData.status === "PlayerBWon" && (
            <p className="pt-10 text-xl text-green-400">
              Winner: {gameData.playerB}
            </p>
          )}
          {gameData.status === "Tie" && (
            <p className="pt-10 text-xl text-yellow-400">
              Game ended and its a tie!
            </p>
          )}
        </div>
        <div className="bg-black grid grid-cols-3 gap-x-1 gap-y-1">
          {Array(9)
            .fill(null)
            .map((_, i) => {
              return (
                <div className="col-span-1 bg-blue-500" key={i}>
                  <Square
                    key={i}
                    ended={ended}
                    color={color}
                    onClick={() => makeMove(i)}
                    value={squares[i]}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
