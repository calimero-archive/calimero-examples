import { useRouter } from "next/router";
import GameBoard from "../components/nh/gameBoard/GameBoard";
import GameCard from "../components/nh/gameCard/GameCard";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";

const gameData = {
  boardStatus: ["X", "X", "O", "X", "O", "U", "U", "U", "U"],
  playerA: "xabi.calimero",
  playerB: "fran.calimero",
  playerTurn: "xabi.calimero",
  status: "playerAwon",
};

export default function CurrentGamesPage() {
  const router = useRouter();

  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <GameCard
        gameId={1}
        playerA="xabi.calimero"
        playerB="fran.calimero"
        status="InProgress"
      />
      <GameBoard gameData={gameData} gameId={1} />
    </PageWrapper>
  );
}
