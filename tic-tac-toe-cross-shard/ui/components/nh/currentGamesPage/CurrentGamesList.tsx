import StartGameComponent from "../startGameComponents/StartGameComponent";
import translations from "../../../constants/en.global.json";
import { GameProps } from "../../../pages";
import GameCard from "../gameCard/GameCard";
import { RefreshIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { getGameStatus } from "../../../utils/styleFunctions";
import { useState } from "react";
import StartGamePopup from "../startGameComponents/StartGamePopup";

const translation = translations.currentGamesPage;

interface CurrentGameListProps {
  gamesList: GameProps[];
  accountId: String | null;
  startGameMethod: (playerB: string) => void;
}

export default function CurrentGamesList({
  gamesList,
  accountId,
  startGameMethod,
}: CurrentGameListProps) {
  const router = useRouter();
  const [startupPopup, setStartupPopup] = useState(false);

  return (
    <>
      {startupPopup ? (
        <StartGamePopup
          contractCall={(playerB) => startGameMethod(playerB)}
          setClose={setStartupPopup}
        />
      ) : (
        <div>
          <div className="font-medium text-2xl leading-7 mt-12 text-white">
            {translation.pageTitle}
          </div>
          <div
            className="w-full flex justify-end"
            onClick={() => router.reload()}
          >
            <div className="flex text-white cursor-pointer hover:text-nh-purple">
              <p className="mr-2">{translation.refreshButtonTitle}</p>
              <RefreshIcon className="w-6 h-6" />
            </div>
          </div>
          {gamesList.length === 0 && accountId ? (
            <StartGameComponent
              buttonTitle={translation.buttonText}
              title={translation.componentTitle}
              setStartupPopup={setStartupPopup}
            />
          ) : (
            <div className="grid grid-cols-1 space-y-6 mt-8">
              {gamesList
                .filter((game) => game.status === "InProgress")
                .map((game, id) => {
                  return (
                    <div key={id}>
                      <GameCard
                        gameId={game.gameId}
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
      )}
    </>
  );
}
