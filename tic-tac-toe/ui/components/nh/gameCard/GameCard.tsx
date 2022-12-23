import Link from "next/link";
import translations from "../../../constants/en.global.json";

const GameCardTranslations = translations.GameCard;

interface GameCardProps {
  gameId: number;
  playerA: string;
  playerB: string;
  status: string;
  play?: boolean;
}

export default function GameCard({
  gameId,
  playerA,
  playerB,
  status,
  play = true,
}: GameCardProps) {
  console.log(status);
  const getStyle = (status: string) => {
    switch (status) {
      case "Win!":
        return "linear-gradient(90deg, rgba(0, 255, 171, 0.138) 0%, rgba(33, 35, 37, 0.2) 100%), #212325";
      case "Lose!":
        return "linear-gradient(90deg, rgba(239, 68, 68, 0.138) 0%, rgba(33, 35, 37, 0.2) 100%), #212325";
      case "Continue game":
        return "#212325";
      case "Tie!":
        return "linear-gradient(90deg, rgba(239, 180, 28, 0.184) 0%, rgba(33, 35, 37, 0.2) 100%), #212325";
    }
  };
  const textColor = (status: string) => {
    switch (status) {
      case "Win!":
        return "text-nh-green";
      case "Lose!":
        return "text-nh-red";
      case "Continue game":
        return "text-nh-navigation-text";
      case "Tie!":
        return "text-nh-testnet";
    }
  };

  return (
    <div
      className={`rounded-lg px-6 py-8 flex ${
        !play && "justify-between"
      } items-center`}
      style={{
        background: getStyle(status),
      }}
    >
      <div className="text-white font-semibold text-base">
        {GameCardTranslations.gameText}
        {gameId}
      </div>
      <div className="flex pr-32 pl-10">
        <div className="text-start">
          <div className="text-xs text-gray-500">
            {GameCardTranslations.playerOneText}
          </div>
          <div className="text-sm text-white">{playerA}</div>
        </div>
        <div className="text-white font-black text-base mx-10 mt-2">VS</div>
        <div>
          <div className="text-xs text-gray-500">
            {GameCardTranslations.playerTwoText}
          </div>
          <div className="text-sm text-white">{playerB}</div>
        </div>
      </div>
      {play && (
        <div>
          {status !== "Continue game" ? (
            <div className={`${textColor(status)} font-semibold text-base`}>
              {status}
            </div>
          ) : (
            <Link href={`/game/${gameId}`}>
              <div
                className={`${textColor(
                  status
                )} font-semibold text-base hover:text-nh-purple cursor-pointer`}
              >
                {status}
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
