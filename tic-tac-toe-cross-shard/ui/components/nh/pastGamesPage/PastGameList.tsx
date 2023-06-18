import translations from "../../../constants/en.global.json";
import { GameProps } from "../../../pages";
import GameCard from "../gameCard/GameCard";
import { getGameStatus } from "../../../utils/styleFunctions";
import Spinner from "../spinner/Spinner";
import { useEffect, useState } from "react";

const translation = translations.pastGamesPage;

interface PastGameListProps {
  gamesList: GameProps[];
  accountId: string | null;
  loadingGamesData: boolean;
}

export default function PastGameList({
  gamesList,
  accountId,
  loadingGamesData,
}: PastGameListProps) {
  const [scores, setScores] = useState<number[]>([0, 0, 0]);
  const getScores = (gamesList: GameProps[]) => {
    const games = gamesList.filter((game) => game.status !== "InProgress");
    let score: number[] = [0, 0, 0];
    games.forEach((game) => {
      switch (getGameStatus(game.status, game.playerA, accountId || "")) {
        case "Win!":
          score[0] += 1;
          break;
        case "Lose!":
          score[1] += 1;
          break;
        case "Tie!":
          score[2] += 1;
          break;
      }
    });
    setScores(score);
  };

  useEffect(() => {
    getScores(gamesList);
  }, [gamesList]);
  return (
    <>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        {translation.pageTitle}
      </div>
      {loadingGamesData ? (
        <div className="flex justify-center mt-20">
          <div>
            <div className="flex justify-center items-center pb-4">
              <Spinner />
            </div>
            <p className="text-white">{translation.loading}</p>
          </div>
        </div>
      ) : (
        <>
          {gamesList.length === 0 && (
            <div className="flex justify-center text-white">
              {translation.noGamesTitle}
            </div>
          )}
          {gamesList.filter((game) => game.status !== "InProgress").length ===
            0 && accountId ? (
            <div className="flex justify-center text-white">
              {translation.noGamesTitle}
            </div>
          ) : (
            <div className="grid grid-cols-1 space-y-6 mt-8">
              {accountId && (
                <>
                  <div className="text-white">
                    <p>
                      {translation.winText} {scores[0]}
                    </p>
                    <p>
                      {translation.loseText} {scores[1]}
                    </p>
                    <p>
                      {translation.tieText} {scores[2]}
                    </p>
                  </div>
                  {gamesList
                    .filter((game) => game.status !== "InProgress")
                    .map((game, id) => {
                      return (
                        <div key={id}>
                          <GameCard
                            gameId={id}
                            playerA={game.playerA}
                            playerB={game.playerB}
                            status={getGameStatus(
                              game.status,
                              game.playerA,
                              accountId
                            )}
                          />
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
