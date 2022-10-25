import calimeroSdk from "./calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";
import * as big from "bn.js";
import { InMemorySigner } from "near-api-js";
import { KeyPair } from "near-api-js/lib/utils";

const ACCOUNT_ID = "accountId";
const PUBLIC_KEY = "publicKey";

let networkId: string;
let contractAddress: string;
if (
  process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID &&
  process.env.NEXT_PUBLIC_CALIMERO_CONTRACT_ADDRESS
) {
  networkId = process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID;
  contractAddress = process.env.NEXT_PUBLIC_CALIMERO_CONTRACT_ADDRESS;
}

interface MakeMoveProps {
  boardIndex: number;
  gameId: number;
}
export async function makeMoveMethod({ boardIndex, gameId }: MakeMoveProps) {
  let sender;
  try {
    sender = localStorage.getItem(ACCOUNT_ID);
  } catch (error) {
    console.log("Error while fetching local storage.");
  }

  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );

  let keyPair = await keyStore.getKey(networkId, sender);
  const signer = await nearAPI.InMemorySigner.fromKeyPair(
    networkId,
    sender,
    keyPair
  );

  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    signer: signer,
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/${networkId}/neard-rpc/`,
    walletUrl: `${process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL}`,
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY || "",
    },
  });
  let account = new nearAPI.Account(calimeroConnection.connection, sender);
  let contract = new nearAPI.Contract(account, contractAddress, {
    viewMethods: [],
    changeMethods: ["make_a_move"],
  });
  try {
    await contract["make_a_move"](
      {
        game_id: gameId,
        selected_field: boardIndex,
      },
      new big.BN("300000000000000"),
      new big.BN("0")
    );
  } catch (error) {}
}

interface StartNewGameProps {
  playerB: string;
}

export async function startNewGameMethod({ playerB }: StartNewGameProps) {
  let sender;
  try {
    sender = localStorage.getItem(ACCOUNT_ID);
  } catch (error) {
    console.log("Error while fetching local storage.");
  }
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );

  let keyPair = await keyStore.getKey(networkId, sender);
  const signer = await nearAPI.InMemorySigner.fromKeyPair(
    networkId,
    sender,
    keyPair
  );
  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    signer: signer,
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/${networkId}/neard-rpc/`,
    walletUrl: `${process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL}`,
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY || "",
    },
  });
  let account = new nearAPI.Account(calimeroConnection.connection, sender);
  let contract = new nearAPI.Contract(account, contractAddress, {
    viewMethods: [],
    changeMethods: ["start_game"],
  });
  try {
    await contract["start_game"](
      {
        player_a: sender.toString(),
        player_b: playerB,
      },
      new big.BN("300000000000000"),
      new big.BN("0")
    );
  } catch (error) {
    console.log(error);
  }
}

export async function addFunctionKey() {
  let sender;
  let publicKeyAsStr;
  try {
    sender = localStorage.getItem(ACCOUNT_ID);
    let publicKeyArrray = localStorage.getItem(PUBLIC_KEY);
    if (publicKeyArrray) {
      publicKeyAsStr = bs58.encode(JSON.parse(publicKeyArrray));
    }
  } catch (error) {
    console.log("Error while fetching local storage.");
  }
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    signer: new InMemorySigner(keyStore),
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/${networkId}/neard-rpc/`,
    walletUrl: process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL,
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY || "",
    },
  });

  const calimeroProvider = calimeroConnection.connection.provider;
  // @ts-expect-error: Argument of type 'string[]' is not assignable to parameter of type 'RpcQueryRequest'
  const accessKey = await calimeroProvider.query([
    `access_key/${sender}/${publicKeyAsStr}`,
    "",
  ]);
  const recentBlockHash = nearAPI.utils.serialize.base_decode(
    accessKey.block_hash
  );
  // @ts-expect-error: Property 'nonce' does not exist on type 'QueryResponseKind'
  const nonce = ++accessKey.nonce + 1;

  let newKeyPair = KeyPair.fromRandom("ed25519");
  let keystore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );
  keystore.setKey(networkId, sender, newKeyPair);

  const method_names = ["make_a_move", "start_game"];
  const allowance = nearAPI.utils.format.parseNearAmount("1");
  const actions = [
    nearAPI.transactions.addKey(
      newKeyPair.getPublicKey(),
      nearAPI.transactions.functionCallAccessKey(
        contractAddress,
        method_names,
        allowance
      )
    ),
  ];

  const transaction = nearAPI.transactions.createTransaction(
    sender,
    newKeyPair.getPublicKey(),
    sender,
    nonce,
    actions,
    recentBlockHash
  );

  let serializedTx;

  try {
    serializedTx = nearAPI.utils.serialize.serialize(
      nearAPI.transactions.SCHEMA,
      transaction
    );
  } catch (e) {
    console.log("ERROR: serialization of transaction!");
  }

  try {
    calimeroSdk.signTransaction(
      encodeURIComponent(Buffer.from(serializedTx).toString("base64")),
      window.location.href.toString()
    );
  } catch (e) {
    console.log(e);
  }
}
