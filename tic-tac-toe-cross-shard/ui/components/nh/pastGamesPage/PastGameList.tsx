import translations from "../../../constants/en.global.json";
import { GameProps } from "../../../pages";
import GameCard from "../gameCard/GameCard";
import { getGameStatus } from "../../../utils/styleFunctions";
import Spinner from "../spinner/Spinner";

const translation = translations.currentGamesPage;

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

  return (
    <>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        {translation.pastGamesTitle}
      </div>
      {loadingGamesData ? (
        <div className="flex justify-center mt-20">
          <div>
            <div className="flex justify-center items-center pb-4">
              <Spinner />
            </div>
            <p className="text-white">Loading games</p>
          </div>
        </div>
      ) : (
        <>
          {gamesList.length == 0 && accountId ? (
            <></>
          ) : (
            <div className="grid grid-cols-1 space-y-6 mt-8">
              {accountId &&
                gamesList
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
            </div>
          )}
        </>
      )}
    </>
  );
}
