import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageWrapper from "../../components/nh/pageWrapper/PageWrapper";
import GameCard from "../../components/nh/gameCard/GameCard";
import { GameProps } from "..";
import GameBoard from "../../components/nh/gameBoard/GameBoard";
import { getGameData, makeAMoveMethod } from "../../utils/callMethods";
import { getGameStatus } from "../../utils/styleFunctions";
import translations from "../../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../../utils/calimeroSdk";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const [gameStatus, setGameStatus] = useState<GameProps>();
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const setGame = async () => {
      getGameData(
        parseInt(id?.toString() || ""),
        setGameStatus,
        walletConnectionObject
      );
    };
    if (!!id) {
      setGame();
    }
  }, [id, walletConnectionObject]);

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = await walletConnectionObject?.account();
      if (account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
    };
    init();
  }, []);

  const signIn = async () => {
    await walletConnectionObject?.requestSignIn({
      contractId: contractName,
      methodNames: ["make_a_move", "start_game"],
    });
  };

  const signOut = async () => {
    await walletConnectionObject?.signOut();
    setIsSignedIn(false);
  };

  const makeMoveFunctionCall = async (id: number, squareId: number) => {
    await makeAMoveMethod(id, squareId, walletConnectionObject);
    router.reload();
  };

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
      {gameStatus && id && (
        <div className="mt-10">
          <GameCard
            gameId={parseInt(id.toString())}
            playerA={gameStatus.playerA}
            playerB={gameStatus.playerB}
            status={getGameStatus(gameStatus.status)}
            play={false}
          />
          {gameStatus.playerTurn == localStorage.getItem("accountId") && (
            <div className="flex justify-center items-center mt-4 text-white text-base font-semibold">
              {translations.currentGamesPage.turnText}
            </div>
          )}
          <GameBoard
            gameData={gameStatus}
            gameId={parseInt(id.toString())}
            callMethod={(id, squareId) => makeMoveFunctionCall(id, squareId)}
          />
        </div>
      )}
    </PageWrapper>
  );
}
