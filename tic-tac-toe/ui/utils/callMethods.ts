import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import * as nearAPI from "near-api-js";
import { Contract } from "near-api-js";
import { GameProps } from "../pages";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export const startGameMethod = async (playerB: string, walletConnectionObject: WalletConnection | undefined) => {
    const account = walletConnectionObject?.account();  
    if (account){
      const contract = new Contract(account,
        contractName,
        {
          viewMethods: [],
          changeMethods: ["vote"],
        });
      await contract["start_game"](
      {
      player_a: account.accountId,
      player_b: playerB,
    },
      "300000000000000",
    );
    }
};

export async function getNumberOfGames(walletConnectionObject: WalletConnection | undefined) {
    if (walletConnectionObject) {
      const account = await walletConnectionObject.account();
      if(account.accountId){
      const contract = new nearAPI.Contract(
        account,
        contractName,
        { viewMethods: ["num_of_games"], changeMethods: [] }
      );
      const numOfGames = await contract["num_of_games"]({});
      return numOfGames;
      }
    }
  };

export async function getGame(gameId: number, walletConnectionObject: WalletConnection | undefined) {
    if (walletConnectionObject) {
      const account = await walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        contractName,
        { viewMethods: ["get_game"], changeMethods: [] }
      );
      const game = await contract["get_game"]({ game_id: gameId });
      return game;
    }
};

export const setGames = async (
    setNumberOfGames: (numberOfGames: string) => void,
    numberOfGames: string,
    setGamesData: (gameData: GameProps[]) => void,
    walletConnectionObject: WalletConnection | undefined,
) => {
    setNumberOfGames(await getNumberOfGames(walletConnectionObject));
    if (numberOfGames) {
      const gamesDataTemp: GameProps[] = [];
      for (let i = 1; i < parseInt(numberOfGames); i++) {
        let temp = await getGame(i, walletConnectionObject);
        const gameData = {
          boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
          playerA: temp.player_a,
          playerB: temp.player_b,
          playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
          status: temp.status,
          gameId: i,
        };
        const loggedUser = localStorage.getItem("accountId");
        console.log(gameData);
        if (gameData.playerA == loggedUser || gameData.playerB === loggedUser) {
          gamesDataTemp.push(gameData);
        }
      }
      setGamesData(gamesDataTemp);
    }
  };

  export const makeAMoveMethod = async (id : number, squareId: number, calimero: CalimeroSdk | undefined) => {
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
        receiverId: contractName,
        actions: [
          nearAPI.transactions.functionCall(
            "make_a_move",
            Buffer.from(JSON.stringify(contractArgs)),
            30000000000000,
            "0"
          ),
        ],
        walletMeta: meta,
      });
    } catch (error) {
      console.log(error);
    }
};

export async function getGameData(
    gameId: number,
    setGameStatus: (gameStatus: GameProps) => void,
    walletConnectionObject: WalletConnection | undefined
  ) {
    if (walletConnectionObject) {
      const account = walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        contractName,
        { viewMethods: ["get_game"], changeMethods: [] }
      );
      const temp = await contract["get_game"]({ game_id: gameId });
      const gameData = {
        boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
        playerA: temp.player_a,
        playerB: temp.player_b,
        playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
        status: temp.status,
        gameId: gameId,
      };
      setGameStatus(gameData);
    }
};
