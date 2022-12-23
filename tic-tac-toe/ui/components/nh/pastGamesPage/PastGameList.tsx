import StartGameComponent from "../startGameComponents/StartGameComponent";
import translations from "../../../constants/en.global.json";
import { GameProps, getGameStatus } from "../../../pages";
import GameCard from "../gameCard/GameCard";

const translation = translations.currentGamesPage;

interface PastGameListProps {
  gamesList: GameProps[];
  loading: boolean;
  accountId: String | null;
}

export default function PastGameList({
  gamesList,
  loading,
  accountId,
}: PastGameListProps) {
  return (
    <div>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        Past Games
      </div>
      {gamesList.length === 0 && accountId ? (
        <StartGameComponent
          buttonTitle={translation.buttonText}
          title={translation.componentTitle}
        />
      ) : (
        <div className="grid grid-cols-1 space-y-6 mt-8">
          {gamesList
            .filter((game) => game.status !== "InProgress")
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
