import { useRouter } from "next/router";
import GameBoard from "../components/nh/gameBoard/GameBoard";
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
      <GameBoard gameData={gameData} gameId={1} />
    </PageWrapper>
  );
}
