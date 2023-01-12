import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageWrapper from "../../components/nh/pageWrapper/PageWrapper";
import useCalimero from "../../hooks/useCalimero";
import GameCard from "../../components/nh/gameCard/GameCard";
import { GameProps } from "..";
import GameBoard from "../../components/nh/gameBoard/GameBoard";
import { getGameData, makeAMoveMethod } from "../../utils/callMethods";
import { getGameStatus } from "../../utils/styleFunctions";
import translations from "../../constants/en.global.json";

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const { calimero, walletConnectionObject } = useCalimero();
  const [gameStatus, setGameStatus] = useState<GameProps>();

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

  return (
    <PageWrapper
      title={translations.pages.currentGame}
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
            callMethod={(id, squareId) =>
              makeAMoveMethod(id, squareId, calimero)
            }
          />
        </div>
      )}
    </PageWrapper>
  );
}
