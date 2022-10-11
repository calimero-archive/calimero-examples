import * as nearAPI from "near-api-js";
import { KeyStore } from "near-api-js/lib/key_stores";

export const shardId = "k-calimero-testnet";
export const contractAddress = "tictactoe.k.calimero.testnet";

export const getCalimeroRpcNodeUrl = (shardIdNamespace: string) => `
/${shardId}/neard-rpc/
  `;

export const MAX_GAS = 300000000000000;
export interface ContractCallProps {
  playerA: string;
  playerB: string;
}
export interface AccountCredentials {
  publicKey: string;
  private_key: string;
}

export const getConfig = (keyStore: KeyStore, shardId: string) => {
  return {
    networkId: shardId,
    nodeUrl: getCalimeroRpcNodeUrl(shardId),
    shardId,
    deps: {
      keyStore,
    },
    headers: {
      authorization: "",
    },
  };
};

export const getAccountCredentials = (player: string) => {};

interface connectedData {
  account: nearAPI.Account;
  keyStore: KeyStore;
}

export async function connectToShard(player: string): Promise<connectedData> {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const near = await nearAPI.connect(getConfig(keyStore, shardId));

  const account = await near.account(player);
  return { account, keyStore };
}
