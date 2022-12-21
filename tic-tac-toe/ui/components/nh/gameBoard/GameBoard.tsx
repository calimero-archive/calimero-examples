import { useEffect, useState } from "react";
import Square from "./Square";

export interface GameProps {
  boardStatus: string[];
  playerA: string;
  playerB: string;
  playerTurn: string;
  status: string;
}

interface IProps {
  gameData: GameProps;
  gameId: number;
}

export default function GameBoard({ gameData, gameId }: IProps) {
  console.log(gameData);
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
      setColor("hover:bg-nh-testnet transition duration-700");
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
      //make_a_move_function_call
      //getGame();
    }
  };
  return (
    <>
      <div className="px-10 py-10 flex justify-center gap-x-4">
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {Array(9)
            .fill(null)
            .map((_, i) => {
              return (
                <div className="col-span-1" key={i}>
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
