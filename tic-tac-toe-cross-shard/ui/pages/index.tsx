import { useRouter } from "next/router";
import CurrentGamesList from "../components/nh/currentGamesPage/CurrentGamesList";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import { useEffect, useState } from "react";
import { getGame, getNumberOfGames, setGames } from "../utils/callMethods";
import translations from "../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import useNear from "../utils/useNear";
import { Near } from "near-api-js";

export interface CalimeroConfig {
  shardId?: string;
  calimeroUrl: string;
  walletUrl?: string;
  calimeroToken: string;
}

export interface Calimero {
  connection: Near;
  config: CalimeroConfig;
}

export interface GameProps {
  boardStatus: string[];
  playerA: string;
  playerB: string;
  playerTurn: string;
  status: string;
  gameId: number;
}

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;
let calimero: Calimero | undefined = undefined;

export default function CurrentGamesPage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [nearAccountId, setNearAccountId] = useState("");
  const [gamesData, setGamesData] = useState<GameProps[]>();
  const [accountId, setAccountId] = useState<string | null>("");
  const [loadingGamesData, setLoadingGamesData] = useState(false);
  const {
    login,
    logout,
    register,
    registerStatus,
    nearSignedIn,
    setRegisterStatus,
  } = useNear();

  const signOut = () => {
    if (accountId) {
      setAccountId("");
      walletConnectionObject?.signOut();
      localStorage.removeItem("calimeroAccountId");
      setIsSignedIn(false);
    }
  };

  useEffect(() => {
    const fetchGameData = async () => {
      setLoadingGamesData(true);
      const numberOfGamesResult = await getNumberOfGames(calimero);
      if (numberOfGamesResult > 0) {
        const gamesDataTemp: GameProps[] = [];
        for (let i = 0; i < parseInt(numberOfGamesResult); i++) {
          let temp = await getGame(i, calimero);
          const gameData = {
            boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
            playerA: temp.player_a,
            playerB: temp.player_b,
            playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
            status: temp.status,
            gameId: i,
          };
          const loggedUser = localStorage.getItem("nearAccountId");
          if (
            gameData.playerA == loggedUser ||
            gameData.playerB === loggedUser
          ) {
            gamesDataTemp.push(gameData);
          }
        }
        setGamesData(gamesDataTemp);
      } else {
        setGamesData([]);
      }
      setLoadingGamesData(false);
    };

    if (nearSignedIn && calimero && !gamesData) {
      fetchGameData();
    }
  }, [nearSignedIn, gamesData, calimero]);

  useEffect(() => {
    const init = async () => {
      calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      await walletConnectionObject.isSignedInAsync();
      localStorage.setItem(
        "calimeroAccountId",
        walletConnectionObject.getAccountId()
      );
      setAccountId(walletConnectionObject.getAccountId());
      const nearAccount = localStorage.getItem("nearAccountId");
      setNearAccountId(nearAccount ?? "");
    };
    if (nearSignedIn) {
      init();
      setAccountId(localStorage.getItem("nearAccountId"));
    }
  }, [nearSignedIn]);

  return (
    <PageWrapper
      isSignedIn={isSignedIn}
      title={translations.pages.indexPageTitle}
      currentPage={router.pathname}
      nearLogin={login}
      nearLogout={() => {
        logout();
        router.reload();
      }}
      calimeroLogout={signOut}
      gameRegister={register}
      status={registerStatus}
      setStatus={setRegisterStatus}
      nearSignedIn={nearSignedIn}
      nearAccountId={nearAccountId}
      accountId={accountId ?? ""}
    >
      <CurrentGamesList
        gamesList={gamesData || []}
        loadingGamesData={loadingGamesData}
        accountId={nearAccountId}
      />
    </PageWrapper>
  );
}
