import StartGameComponent from "../startGameComponents/StartGameComponent";
import translations from "../../../constants/en.global.json";
import { GameProps, getGameStatus } from "../../../pages";
import GameCard from "../gameCard/GameCard";
import useCalimero from "../../../hooks/useCalimero";

const translation = translations.currentGamesPage;

interface CurrentGameListProps {
  gamesList: GameProps[];
  loading: boolean;
  accountId: String | null;
}

export default function CurrentGamesList({
  gamesList,
  loading,
  accountId,
}: CurrentGameListProps) {
  return (
    <div>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        {translation.pageTitle}
      </div>
      {gamesList.length === 0 && accountId ? (
        <StartGameComponent
          buttonTitle={translation.buttonText}
          title={translation.componentTitle}
        />
      ) : (
        <div className="grid grid-cols-1 space-y-6 mt-8">
          {gamesList
            .filter((game) => game.status === "InProgress")
            .filter((game) => {
              return game.playerA === accountId || game.playerB === accountId;
            })
            .map((game, id) => {
              return (
                <div key={id}>
                  <GameCard
                    gameId={id}
                    playerA={game.playerA}
                    playerB={game.playerB}
                    status={getGameStatus(game.status)}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
