import { useRouter } from "next/router";
import CurrentGamesList from "../components/nh/currentGamesPage/CurrentGamesList";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import useCalimero from "../hooks/useCalimero";
import { useEffect, useState } from "react";
import { setGames } from "../utils/callMethods";
import translations from "../constants/en.global.json";

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
      title={translations.pages.indexPageTitle}
      currentPage={router.pathname}
    >
      <CurrentGamesList gamesList={gamesData || []} accountId={accountId} />
    </PageWrapper>
  );
}
