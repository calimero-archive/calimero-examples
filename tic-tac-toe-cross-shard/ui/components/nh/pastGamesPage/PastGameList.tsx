import StartGameComponent from "../startGameComponents/StartGameComponent";
import translations from "../../../constants/en.global.json";
import { GameProps } from "../../../pages";
import GameCard from "../gameCard/GameCard";
import { getGameStatus } from "../../../utils/styleFunctions";
import { useState } from "react";
import StartGamePopup from "../startGameComponents/StartGamePopup";

const translation = translations.currentGamesPage;

interface PastGameListProps {
  gamesList: GameProps[];
  accountId: string | null;
  startGameMethod: (playerB: string) => void;
}

export default function PastGameList({
  gamesList,
  accountId,
  startGameMethod,
}: PastGameListProps) {
  const [startupPopup, setStartupPopup] = useState(false);

  return (
    <div>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        {translation.pageTitle}
      </div>
      {startupPopup && (
        <StartGamePopup
          contractCall={(playerB) => startGameMethod(playerB)}
          setClose={setStartupPopup}
        />
      )}
      {gamesList.length == 0 && accountId ? (
        <StartGameComponent
          buttonTitle={translation.buttonText}
          title={translation.componentTitle}
          setStartupPopup={setStartupPopup}
        />
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
    </div>
  );
}
