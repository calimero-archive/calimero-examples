import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Board from "../../components/Board";
import { GameProps, getGames } from "../../components/dashboard/OpenGameList";
import MenuNavigation from "../../components/Navigation";
import calimeroSdk from "../../utils/calimeroSdk";

export default function Game() {
  const router = useRouter();
  const [gameData, setGameData] = useState<GameProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = router.query;
  const getGame = async () => {
    if (id) {
      setLoading(true);
      const temp = await getGames(parseInt(id.toString()));
      let gameData = {
        boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
        playerA: temp.player_a,
        playerB: temp.player_b,
        playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
        status: temp.status,
      };
      setGameData(gameData);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!calimeroSdk.isSignedIn()) {
      router.replace("/");
    }
    const setupGame = async () => {
      await getGame();
    };
    if (!gameData) {
      setupGame();
    }
  }, [id]);

  return (
    <div>
      <Head>
        <title>Tic Tac Toe | Calimero Game</title>
        <meta name="description" content="TicTacToe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuNavigation />
      <div className="pt-24 flex justify-center items-center bg-black h-screen">
        <div className="w-2/3">
          <div className="bg-white">
            {!loading && gameData && id && (
              <Board
                gameData={gameData}
                gameId={parseInt(id.toString())}
                getGame={getGame}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
