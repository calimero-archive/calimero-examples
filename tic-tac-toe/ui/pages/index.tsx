import { useRouter } from "next/router";
import CurrentGamesList from "../components/nh/currentGamesPage/CurrentGamesList";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import useCalimero from "../hooks/useCalimero";
import * as nearAPI from "near-api-js";
import { useEffect, useState } from "react";

export interface GameProps {
  boardStatus: string[];
  playerA: string;
  playerB: string;
  playerTurn: string;
  status: string;
}

export const getGameStatus = (status: string) => {
  switch (status) {
    case "PlayerAWon":
      return "Win!";
    case "PlayerBWon":
      return "Lose!";
    case "InProgress":
      return "Continue game";
    default:
      return "Tie!";
  }
};

export default function CurrentGamesPage() {
  const router = useRouter();
  const { isSignedIn, calimero, walletConnectionObject } = useCalimero();
  const [numberOfGames, setNumberOfGames] = useState<string>("");
  const [gamesData, setGamesData] = useState<GameProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<String | null>("");
  const setGames = async () => {
    setNumberOfGames(await getNumberOfGames());
    if (numberOfGames) {
      const gamesDataTemp: GameProps[] = [];
      setLoading(true);
      for (let i = 0; i < parseInt(numberOfGames); i++) {
        let temp = await getGame(i);
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

  useEffect(() => {
    if (isSignedIn && localStorage.getItem("accountId")) {
      setAccountId(localStorage.getItem("accountId"));
    }
  }, [gamesData]);

  async function getNumberOfGames() {
    if (walletConnectionObject) {
      const account = await walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        "tictactoe.fran.calimero.testnet",
        { viewMethods: ["num_of_games"], changeMethods: [] }
      );
      const numOfGames = await contract["num_of_games"]({});
      return numOfGames;
    }
  }

  async function getGame(gameId: number) {
    if (walletConnectionObject) {
      const account = await walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        "tictactoe.fran.calimero.testnet",
        { viewMethods: ["get_game"], changeMethods: [] }
      );
      const game = await contract["get_game"]({ game_id: gameId });
      return game;
    }
  }

  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <CurrentGamesList
        gamesList={gamesData || []}
        loading={loading}
        accountId={accountId}
      />
    </PageWrapper>
  );
}
