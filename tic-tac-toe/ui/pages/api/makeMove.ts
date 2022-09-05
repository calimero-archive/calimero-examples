import { connect, KeyPair, keyStores, Contract, Account } from "near-api-js";
import { KeyStore } from "near-api-js/lib/key_stores";
import { parseNearToYocto } from "../../utils/NearApiUtils";

export const shardId = "hackaton-calimero-testnet";
export const contractAddress = "tictactoe.hackathon.calimero.testnet";

export const getCalimeroRpcNodeUrl = (shardIdNamespace: string) => ``;

export default async function handler(req, res) {
  const { player, field, gameId } = req.body;

  try {
    const result = await makeAMoveMethod({
      player,
      field,
      gameId,
    });
    res.status(200).json({
      success: true,
      credentials: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}
const MAX_GAS = 300000000000000;
export interface ContractCallProps {
  player: string;
  field: string;
  gameId: string;
}
interface AccountCredentials {
  publicKey: string;
  secretKey: string;
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

export const getAccountCredentials = (player: string) => {
  const credentials = {
    accountId: "igi.calimero.testnet",
    secretKey: "ed25519:",
    publicKey: "undefined",
  };
  return credentials;
};

interface connectedData {
  account: Account;
  keyStore: KeyStore;
}

async function connectToShard(player: string): Promise<connectedData> {
  const { secretKey } = getAccountCredentials(player);
  const keyStore = new keyStores.InMemoryKeyStore();

  const keyPair = KeyPair.fromString(secretKey);
  await keyStore.setKey(shardId, player, keyPair);

  const near = await connect(getConfig(keyStore, shardId));

  const account = await near.account(player);
  return { account, keyStore };
}

export async function makeAMoveMethod(props: ContractCallProps) {
  const data = await connectToShard(props.player);

  const contract = new Contract(data.account, contractAddress, {
    changeMethods: ["make_a_move"],
    viewMethods: [],
  });

  await contract["storage_deposit"](
    {
      game_id: props.gameId,
      selected_field: props.field,
    },
    MAX_GAS,
    parseNearToYocto("1")
  );
  return contract;
}
