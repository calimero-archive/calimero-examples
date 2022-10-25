import { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { useRouter } from "next/router";
import { startNewGameMethod } from "../../utils/callMethods";
const { Contract } = nearAPI;

export const config = {
  networkId: process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID || "",
  nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/${process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID}/neard-rpc/`,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY || "",
  },
};

export async function getNumberOfGames() {
  const near = await nearAPI.connect(config);
  const account = await near.account(localStorage.getItem("accountId") || "");
  const contract = new Contract(
    account,
    process.env.NEXT_PUBLIC_CALIMERO_CONTRACT_ADDRESS || "",
    {
      viewMethods: ["num_of_games"],
      changeMethods: [],
    }
  );
  let numberOfGames = await contract["num_of_games"]();
  return numberOfGames;
}

export async function getGames(gameId: number) {
  const near = await nearAPI.connect(config);
  const account = await near.account(localStorage.getItem("accountId") || "");
  const contract = new Contract(
    account,
    process.env.NEXT_PUBLIC_CALIMERO_CONTRACT_ADDRESS || "",
    {
      viewMethods: ["get_game"],
      changeMethods: [],
    }
  );
  let game = await contract["get_game"]({ game_id: gameId });
  return game;
}

export interface GameProps {
  boardStatus: string[];
  playerA: string;
  playerB: string;
  playerTurn: string;
  status: string;
}

export default function OpenGamesList() {
  const [numberOfGames, setNumberOfGames] = useState<string>("");
  const [gamesData, setGamesData] = useState<GameProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const setGames = async () => {
    setNumberOfGames(await getNumberOfGames());
    if (numberOfGames) {
      const gamesDataTemp: GameProps[] = [];
      setLoading(true);
      for (let i = 0; i < parseInt(numberOfGames); i++) {
        let temp = await getGames(i);
        const gameData = {
          boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
          playerA: temp.player_a,
          playerB: temp.player_b,
          playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
          status: temp.status,
        };
        gamesDataTemp.push(gameData);
      }
      setGamesData(gamesDataTemp);
      if (gamesDataTemp) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (!numberOfGames || (!gamesData && localStorage.getItem("accountId"))) {
      setGames();
    }
  }, [numberOfGames, gamesData]);
  const getGameStatus = (game: GameProps) => {
    switch (game.status) {
      case "PlayerAWon":
        return "Player " + game.playerA + " won";

      case "PlayerBWon":
        return "Player " + game.playerB + " won";

      case "InProgress":
        return "In progress";
      default:
        return "Its a tie";
    }
  };
  const startNewGame = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let target = e.target as HTMLFormElement;
    const formData = {};
    Array.from(target.elements).forEach((field) => {
      let input = field as HTMLInputElement;
      if (!input.name) return;
      // @ts-ignore:next-line
      formData[input.name] = input.value;
    });
    let playerb = formData["playerB"];
    if (playerb) {
      const data = {
        playerB: playerb,
      };
      console.log();
      await startNewGameMethod(data);
      setGamesData(undefined);
      await setGames();
    }
  };
  return (
    <div className="py-10 px-32 flex justify-center">
      <div className="w-full px-10 py-2 shadow-xl rounded-xl divide-y-2">
        <div className="pt-8">
          {loading && (
            <div className="w-full pt-4 flex justify-center">
              Loading games from smart contract tictactoe deployed on blockchain
            </div>
          )}
          <form
            method="post"
            onSubmit={startNewGame}
            className="flex items-center gap-x-4 pb-10"
          >
            <div className="flex items-center">
              <label htmlFor="firstname">Play with</label>
              <input
                name="playerB"
                type="string"
                className="ml-4 rounded py-2 border border-gray-300 px-2"
                required={true}
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
            >
              Start new Game
            </button>
          </form>

          {gamesData && (
            <div className="grid grid-cols-1 gap-y-10">
              {gamesData.map((game, i) => {
                return (
                  <div
                    key={i}
                    className="px-8 py-2 rounded-xl bg-gray-50 pt-4 flex justify-between font-inter"
                  >
                    <div className="flex items-center gap-x-12">
                      <div className=" text-xl">#{i}</div>
                      <div>
                        <div className="flex items-center gap-x-2">
                          <p>players:</p>
                          <div>
                            <p className="font-black">{game.playerA}</p>
                            <p className="font-black">{game.playerB}</p>
                          </div>
                        </div>
                        <p className="mt-2">
                          on turn:{" "}
                          <span className="font-black">{game.playerTurn}</span>
                        </p>
                        <p className="font-black mt-2">{getGameStatus(game)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {game.status === "InProgress" && (
                        <div className="mx-4 float-left">
                          <button
                            className="bg-black text-white rounded-md hover:bg-violet-700 transition duration-700 px-2 py-2"
                            onClick={() => router.push(`/game/${i}`)}
                          >
                            Start Game
                          </button>
                        </div>
                      )}
                      <div className="bg-black rounded-sm w-32 h-32 grid grid-cols-3 gap-x-[4px] gap-y-[4px]">
                        {game.boardStatus.map((block, i) => {
                          return (
                            <div
                              key={i}
                              className={`${
                                block === "U" ? "text-white" : "text-black"
                              } bg-white flex justify-center items-center text-lg`}
                            >
                              {block === "U" ? "U" : block}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
