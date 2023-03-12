import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageWrapper from "../../components/nh/pageWrapper/PageWrapper";
import GameCard from "../../components/nh/gameCard/GameCard";
import { Calimero, GameProps } from "..";
import GameBoard from "../../components/nh/gameBoard/GameBoard";
import { getGameData, makeAMoveMethod } from "../../utils/callMethods";
import { getGameStatus } from "../../utils/styleFunctions";
import translations from "../../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../../utils/calimeroSdk";
import useNear from "../../utils/useNear";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;
let calimero: Calimero | undefined = undefined;

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const [gameStatus, setGameStatus] = useState<GameProps>();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { login, logout, register, registerStatus, nearSignedIn, setRegisterStatus } = useNear();

  useEffect(() => {
    const setGame = async () => {
      if(calimero){
        getGameData(
        parseInt(id?.toString() || ""),
        setGameStatus,
        calimero
      );
      }
    };
    if (!!id) {
      setGame();
    }
  }, [id, calimero]);

  useEffect(() => {
    const init = async () => {
      calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      const isSigned = await walletConnectionObject?.isSignedInAsync();
      console.log(isSigned);
      if (isSigned) {
        localStorage.setItem("accountId", walletConnectionObject.getAccountId());
      }
      setIsSignedIn(isSigned);

    };
    init();
  }, []);

  const signIn = async () => {
    await walletConnectionObject?.requestSignIn({
      contractId: contractName,
      methodNames: ["make_a_move"],
    });
  };

  const signOut = async () => {
    walletConnectionObject?.signOut();
    setIsSignedIn(false);
    router.push("/");
  };

  const makeMoveFunctionCall = async (id: number, squareId: number) => {
    await makeAMoveMethod(id, squareId, walletConnectionObject,signIn);
    // router.reload();
  };

  return (
    <PageWrapper
      isSignedIn={isSignedIn}
      title={translations.pages.indexPageTitle}
      currentPage={router.pathname}
      nearLogin={login}
      nearLogout={logout}
      gameRegister={register}
      status={registerStatus}
      setStatus={setRegisterStatus}
      nearSignedIn={nearSignedIn}
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
          {gameStatus.playerTurn == localStorage.getItem("nearAccountId") && (
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
