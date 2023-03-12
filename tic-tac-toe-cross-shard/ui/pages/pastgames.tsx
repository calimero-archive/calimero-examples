import { useRouter } from "next/router";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import PastGameList from "../components/nh/pastGamesPage/PastGameList";
import translations from "../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import { useEffect, useState } from "react";
import { setGames } from "../utils/callMethods";
import { Calimero, GameProps } from ".";
import useNear from "../utils/useNear";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;
let calimero: Calimero | undefined = undefined;

export default function PastGames() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [numberOfGames, setNumberOfGames] = useState<string>("");
  const [gamesData, setGamesData] = useState<GameProps[]>();
  const [accountId, setAccountId] = useState<string | null>("");
  const [loadingGamesData, setLoadingGamesData] = useState(true);
  const {
    login,
    logout,
    register,
    registerStatus,
    nearSignedIn,
    setRegisterStatus,
  } = useNear();

  const signOut = () => {
    walletConnectionObject?.signOut();
    localStorage.removeItem("calimeroAccountId");
    setIsSignedIn(false);
  };

  useEffect(() => {
    if (
      !numberOfGames ||
      (!gamesData && localStorage.getItem("nearAccountId"))
    ) {
      if (nearSignedIn) {
        setGames(
          setNumberOfGames,
          numberOfGames,
          setGamesData,
          setLoadingGamesData,
          calimero
        );
      }
    }
  }, [numberOfGames, gamesData, nearSignedIn]);

  useEffect(() => {
    const init = async () => {
      calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      await walletConnectionObject.isSignedInAsync();
      localStorage.setItem("calimeroAccountId",walletConnectionObject.getAccountId());
    };
    if (nearSignedIn) {
      init();
      setAccountId(localStorage.getItem("nearAccountId"));
    }
  }, [nearSignedIn]);

  useEffect(() => {
    const absolute = window.location.href.split("?");
    const url = absolute[0];
    router.replace(url);
  }, [isSignedIn]);

  return (
    <PageWrapper
      isSignedIn={isSignedIn}
      title={translations.pages.indexPageTitle}
      currentPage={router.pathname}
      nearLogin={login}
      nearLogout={logout}
      calimeroLogout={signOut}
      gameRegister={register}
      status={registerStatus}
      setStatus={setRegisterStatus}
      nearSignedIn={nearSignedIn}
    >
      <PastGameList
        gamesList={gamesData || []}
        loadingGamesData={loadingGamesData}
        accountId={accountId}
      />
    </PageWrapper>
  );
}
