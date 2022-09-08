import { connect, KeyPair, keyStores, Account } from "near-api-js";
import { KeyStore } from "near-api-js/lib/key_stores";

export const shardId = "hackathon-calimero-testnet";
export const contractAddress = "tictactoe.hackathon.calimero.testnet";

export const getCalimeroRpcNodeUrl = (shardIdNamespace: string) => `
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
  account: Account;
  keyStore: KeyStore;
}

export async function connectToShard(player: string): Promise<connectedData> {
  const private_key  = "bla";
  const keyStore = new keyStores.InMemoryKeyStore();

  const keyPair = KeyPair.fromString(private_key);
  await keyStore.setKey(shardId, player, keyPair);

  const near = await connect(getConfig(keyStore, shardId));

  const account = await near.account(player);
  return { account, keyStore };
}
