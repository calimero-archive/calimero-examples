import { WalletConnection } from "calimero-sdk";
import * as nearAPI from "near-api-js";
import { Contract } from "near-api-js";
import { NextRouter } from "next/router";
import { Calimero, GameProps } from "../pages";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export async function getNumberOfGames(calimero: Calimero | undefined) {
  if (calimero) {
    const contract = new nearAPI.Contract(
      new nearAPI.Account(calimero.connection.connection, contractName),
      contractName,
      {
        viewMethods: ["num_of_games"],
        changeMethods: [],
      }
    );
    try {
      const numOfGames = await contract["num_of_games"]({});
      return numOfGames;
    } catch (error) {
      console.log(error);
    }
  }
}

export async function getGame(gameId: number, calimero: Calimero | undefined) {
  if (calimero) {
    const contract = new nearAPI.Contract(
      new nearAPI.Account(calimero.connection.connection, contractName),
      contractName,
      {
        viewMethods: ["get_game"],
        changeMethods: [],
      }
    );
    const game = await contract["get_game"]({ game_id: gameId });
    return game;
  }
}

export const setGames = async (
  setNumberOfGames: (numberOfGames: string) => void,
  numberOfGames: string,
  setGamesData: (gameData: GameProps[]) => void,
  setLoadingGamesData: (loadingGamesData: boolean) => void,
  calimero: Calimero | undefined
) => {
  setLoadingGamesData(true);
  setNumberOfGames(await getNumberOfGames(calimero));
  if (numberOfGames) {
    const gamesDataTemp: GameProps[] = [];
    for (let i = 0; i < parseInt(numberOfGames); i++) {
      let temp = await getGame(i, calimero);
      const gameData = {
        boardStatus: temp.board[0].concat(temp.board[1], temp.board[2]),
        playerA: temp.player_a,
        playerB: temp.player_b,
        playerTurn: temp.player_a_turn ? temp.player_a : temp.player_b,
        status: temp.status,
        gameId: i,
      };
      const loggedUser = localStorage.getItem("nearAccountId");
      if (gameData.playerA == loggedUser || gameData.playerB === loggedUser) {
        gamesDataTemp.push(gameData);
      }
    }
    setGamesData(gamesDataTemp);
    setLoadingGamesData(false);
  }
};

export const makeAMoveMethod = async (
  id: number,
  squareId: number,
  walletConnectionObject: WalletConnection | undefined,
  signIn: () => void,
  router: NextRouter
) => {
  const account = walletConnectionObject?.account();
  if (!account?.accountId && !localStorage.getItem("calimeroAccountId")) {
    signIn();
  } else if (account) {
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
  calimero: Calimero | undefined
) {
  if (calimero) {
    const contract = new nearAPI.Contract(
      new nearAPI.Account(calimero.connection.connection, contractName),
      contractName,
      {
        viewMethods: ["get_game"],
        changeMethods: [],
      }
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
    return gameData;
  }
}
