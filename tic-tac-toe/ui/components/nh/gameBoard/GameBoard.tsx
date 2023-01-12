import { useEffect, useState } from "react";
import Square from "./Square";
import * as nearAPI from "near-api-js";
import NotificationCard from "../notificationCard/NotificationCard";

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
  callMethod: (id, squareId) => void;
}

export default function GameBoard({ gameData, gameId, callMethod }: IProps) {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(null));
  const [ended, setEnded] = useState<string>("");
  const [color, setColor] = useState<string>("bg-white");
  const [loggedInPlayer, setLoggedInPlayer] = useState<string>("");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

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
    const loggedUser = localStorage.getItem("accountId");
    if (gameData.playerTurn !== loggedUser) {
      setShow(true);
      setTitle("Its not your turn");
      setSubtitle("Wait for other player to make their move!");
    } else {
      setShow(true);
      setTitle("Move has been made");
      setSubtitle("Please wait for Blockchain to save your data!");
      await callMethod(gameId, index);
    }
  };
  return (
    <>
      <div className="absolute top-20 right-8">
        <NotificationCard
          title={title}
          subtitle={subtitle}
          show={show}
          setShow={setShow}
        />
      </div>
      <div className="px-10 py-6 flex justify-center gap-x-4">
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
