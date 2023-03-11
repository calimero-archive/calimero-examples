import { useRouter } from "next/router";
import CurrentGamesList from "../components/nh/currentGamesPage/CurrentGamesList";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import { useEffect, useState } from "react";
import { setGames, startGameMethod } from "../utils/callMethods";
import translations from "../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import useNear from "../utils/useNear";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

let walletConnectionObject: WalletConnection | undefined = undefined;

export interface GameProps {
  boardStatus: string[];
  playerA: string;
  playerB: string;
  playerTurn: string;
  status: string;
  gameId: number;
}

export default function CurrentGamesPage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [numberOfGames, setNumberOfGames] = useState<string>("");
  const [gamesData, setGamesData] = useState<GameProps[]>();
  const [accountId, setAccountId] = useState<String | null>("");
  const { login, logout, register, registerStatus, nearSignedIn, setRegisterStatus } = useNear();

  const signIn = async () => {
    await walletConnectionObject?.requestSignIn({
      contractId: contractName,
      methodNames: ["make_a_move"],
    });
  };

  const signOut = () => {
    walletConnectionObject?.signOut();
    setIsSignedIn(false);
  };

  const startGameFunctionCall = async (playerB: string) => {
    const res = await startGameMethod(playerB, walletConnectionObject);
    router.reload();
  };
  useEffect(() => {
    if (!numberOfGames || (!gamesData && localStorage.getItem("accountId"))) {
      setGames(
        setNumberOfGames,
        numberOfGames,
        setGamesData,
        walletConnectionObject
      );
    }
  }, [numberOfGames, gamesData]);

  useEffect(() => {
    if (isSignedIn && localStorage.getItem("accountId")) {
      setAccountId(localStorage.getItem("accountId"));
    }
  }, [gamesData]);

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = walletConnectionObject?.account();
      if (account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
    };
    init();
  }, []);

  useEffect(() => {
    const absolute = window.location.href.split("?");
    const url = absolute[0];
    router.replace(url);
  }, [isSignedIn]);

  return (
    <PageWrapper
      signIn={signIn}
      isSignedIn={isSignedIn}
      signOut={signOut}
      title={translations.pages.indexPageTitle}
      currentPage={router.pathname}
      nearLogin={login}
      nearLogout={logout}
      gameRegister={register}
      status={registerStatus}
      setStatus={setRegisterStatus}
      nearSignedIn={nearSignedIn}
    >
      <CurrentGamesList
        gamesList={gamesData || []}
        accountId={accountId}
        startGameMethod={(playerB) => startGameFunctionCall(playerB)}
      />
    </PageWrapper>
  );
}
