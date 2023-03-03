import { WalletConnection } from "calimero-sdk";
import * as nearAPI from "near-api-js";
import { Contract } from "near-api-js";
import { GameProps } from "../pages";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export const startGameMethod = async (
  playerB: string,
  walletConnectionObject: WalletConnection | undefined
): Promise<number> => {
  const account = walletConnectionObject?.account();
  if (account) {
    const contract = new Contract(account, contractName, {
      viewMethods: [],
      changeMethods: ["start_game"],
    });
    try {
      const res = await contract["start_game"](
        {
          player_a: account.accountId,
          player_b: playerB,
        },
        "300000000000000"
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  return -1;
};

export async function getNumberOfGames(
  walletConnectionObject: WalletConnection | undefined
) {
  if (walletConnectionObject) {
    const account = await walletConnectionObject.account();
    if (account.accountId) {
      const contract = new nearAPI.Contract(account, contractName, {
        viewMethods: ["num_of_games"],
        changeMethods: [],
      });
      try {
        const numOfGames = await contract["num_of_games"]({});
        return numOfGames;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export async function getGame(
  gameId: number,
  walletConnectionObject: WalletConnection | undefined
) {
  if (walletConnectionObject) {
    const account = await walletConnectionObject.account();
    const contract = new nearAPI.Contract(account, contractName, {
      viewMethods: ["get_game"],
      changeMethods: [],
    });
    const game = await contract["get_game"]({ game_id: gameId });
    return game;
  }
}

export const setGames = async (
  setNumberOfGames: (numberOfGames: string) => void,
  numberOfGames: string,
  setGamesData: (gameData: GameProps[]) => void,
  walletConnectionObject: WalletConnection | undefined
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
      if (gameData.playerA == loggedUser || gameData.playerB === loggedUser) {
        gamesDataTemp.push(gameData);
      }
    }
    setGamesData(gamesDataTemp);
  }
};

export const makeAMoveMethod = async (
  id: number,
  squareId: number,
  walletConnectionObject: WalletConnection | undefined
) => {
  const account = walletConnectionObject?.account();
  if (account) {
    const contract = new Contract(account, contractName, {
      viewMethods: [],
      changeMethods: ["make_a_move"],
    });
    const res = await contract["make_a_move"](
      {
        game_id: id,
        selected_field: squareId,
      },
      "300000000000000"
    );
  }
};

export async function getGameData(
  gameId: number,
  setGameStatus: (gameStatus: GameProps) => void,
  walletConnectionObject: WalletConnection | undefined
) {
  if (walletConnectionObject) {
    const account = walletConnectionObject.account();
    const contract = new nearAPI.Contract(account, contractName, {
      viewMethods: ["get_game"],
      changeMethods: [],
    });
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
}
