import StartGameComponent from "../startGameComponents/StartGameComponent";
import translations from "../../../constants/en.global.json";
import { GameProps, getGameStatus } from "../../../pages";
import GameCard from "../gameCard/GameCard";
import useCalimero from "../../../hooks/useCalimero";
import { RefreshIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

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
  const router = useRouter();
  return (
    <div>
      <div className="font-medium text-2xl leading-7 mt-12 text-white">
        {translation.pageTitle}
      </div>
      <div className="w-full flex justify-end" onClick={() => router.reload()}>
        <div className="flex text-white cursor-pointer hover:text-nh-purple">
          <p className="mr-2">Refresh Games</p>
          <RefreshIcon className="w-6 h-6" />
        </div>
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
  );
}
