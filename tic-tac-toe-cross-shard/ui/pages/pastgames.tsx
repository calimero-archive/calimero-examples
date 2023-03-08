import { useRouter } from "next/router";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import PastGameList from "../components/nh/pastGamesPage/PastGameList";
import translations from "../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import { useEffect, useState } from "react";
import { setGames, startGameMethod } from "../utils/callMethods";
import { GameProps } from ".";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;

export default function PastGames() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState("");

  const [numberOfGames, setNumberOfGames] = useState<string>("");
  const [gamesData, setGamesData] = useState<GameProps[]>();

  const signIn = async () => {
    await walletConnectionObject?.requestSignIn({
      contractId: contractName,
      methodNames: ["make_a_move", "start_game"],
    });
  };

  const signOut = () => {
    walletConnectionObject?.signOut();
    setIsSignedIn(false);
  };

  const startGameFunctionCall = async (playerB: string) => {
    await startGameMethod(playerB, walletConnectionObject);
    router.push("/");
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
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = walletConnectionObject?.account();
      if (account && signedIn) {
        setAccountId(account.accountId);
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
    >
      <PastGameList
        gamesList={gamesData || []}
        accountId={accountId}
        startGameMethod={(playerB) => startGameFunctionCall(playerB)}
      />
    </PageWrapper>
  );
}
