import nearSdk from "./nearSdk";
import * as nearAPI from "near-api-js";

export async function getGame(gameId: number) {
  let contract = await initContract();
  let game = await contract["get_finished_game"]({ game_id: gameId });
  return game.status;
}

export interface GameProps {
  boardStatus: string[];
  playerA: string;
  playerB: string;
  playerTurn: string;
  status: string;
}

async function initContract() {
  const nearConfig = nearSdk();
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
    headers: {},
  });
  //@ts-ignore: next-line
  const walletConnection = new nearAPI.WalletConnection(near);
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),

      balance: (await walletConnection.account().state()).amount,
    };
  }
  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ["num_of_all_games", "get_finished_game"],
      changeMethods: ["register_player"],
      //@ts-ignore:next line
      sender: walletConnection.getAccountId(),
    }
  );
  return contract;
}
