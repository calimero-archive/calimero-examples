import { useRouter } from "next/router";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import useCalimero from "../hooks/useCalimero";
import { useEffect, useState } from "react";
import PastGameList from "../components/nh/pastGamesPage/PastGameList";
import { setGames } from "../utils/callMethods";
import { GameProps } from ".";
import translations from "../constants/en.global.json";

export default function PastGames() {
  const router = useRouter();
  const { isSignedIn, walletConnectionObject } = useCalimero();
  const [numberOfGames, setNumberOfGames] = useState<string>("");
  const [gamesData, setGamesData] = useState<GameProps[]>();
  const [accountId, setAccountId] = useState<String | null>("");

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

  return (
    <PageWrapper
      title={translations.pages.pastGamesTitle}
      currentPage={router.pathname}
    >
      <PastGameList gamesList={gamesData || []} accountId={accountId} />
    </PageWrapper>
  );
}
