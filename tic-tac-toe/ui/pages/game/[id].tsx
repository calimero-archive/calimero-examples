import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageWrapper from "../../components/nh/pageWrapper/PageWrapper";
import useCalimero from "../../hooks/useCalimero";
import * as nearAPI from "near-api-js";
import GameCard from "../../components/nh/gameCard/GameCard";
import { GameProps, getGameStatus } from "..";
import GameBoard from "../../components/nh/gameBoard/GameBoard";

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const { calimero, walletConnectionObject } = useCalimero();
  const [gameStatus, setGameStatus] = useState<GameProps>();

  async function getGame(gameId: number) {
    if (walletConnectionObject) {
      const account = walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        "tictactoe.fran.calimero.testnet",
        { viewMethods: ["get_game"], changeMethods: [] }
      );
      const temp = await contract["get_game"]({ game_id: gameId });
      const gameData = {
        boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
        playerA: temp.player_a,
        playerB: temp.player_b,
        playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
        status: temp.status,
      };
      setGameStatus(gameData);
    }
  }

  const contractCall = async (id, squareId) => {
    const accountId = localStorage.getItem("accountId");
    const publicKey = localStorage.getItem("publicKey");
    //@ts-expect-error
    const calimeroConnection = await calimero.connect();
    //@ts-expect-error
    const walletConnection = new nearAPI.WalletConnection(
      calimeroConnection.connection
    );
    //@ts-expect-error
    walletConnection._authData = { accountId, allKeys: [publicKey] };

    const account = walletConnection.account();

    const contractArgs = {
      game_id: id,
      selected_field: squareId,
    };

    const metaJson = {
      //@ts-expect-error
      calimeroRPCEndpoint: calimeroConnection.config.nodeUrl,
      //@ts-expect-error
      calimeroShardId: calimeroConnection.config.networkId,
      calimeroAuthToken: localStorage.getItem("calimeroToken"),
    };
    const meta = JSON.stringify(metaJson);

    try {
      //@ts-expect-error
      await account.signAndSendTransaction({
        receiverId: "tictactoe.fran.calimero.testnet",
        actions: [
          nearAPI.transactions.functionCall(
            "make_a_move",
            Buffer.from(JSON.stringify(contractArgs)),
            10000000000000,
            "0"
          ),
        ],
        walletMeta: meta,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const setGame = async () => {
      getGame(parseInt(id?.toString() || ""));
    };
    if (!!id) {
      setGame();
    }
  }, [id, walletConnectionObject]);

  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      {gameStatus && id && (
        <div className="mt-10">
          <GameCard
            gameId={parseInt(id.toString())}
            playerA={gameStatus.playerA}
            playerB={gameStatus.playerB}
            status={getGameStatus(gameStatus.status)}
            play={false}
          />
          {gameStatus.playerTurn == localStorage.getItem("accountId") && (
            <div className="flex justify-center items-center mt-4 text-white text-base font-semibold">
              Your turn
            </div>
          )}
          <GameBoard
            gameData={gameStatus}
            gameId={parseInt(id.toString())}
            callMethod={(id, squareId) => contractCall(id, squareId)}
          />
        </div>
      )}
    </PageWrapper>
  );
}
