import calimeroSdk from "./calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";
import * as big from "bn.js";
import { InMemorySigner } from "near-api-js";
import { KeyPair } from "near-api-js/lib/utils";

interface IProps {
  boardIndex: number;
  gameId: number;
}
export async function makeMoveMethod({ boardIndex, gameId }: IProps) {
  const authToken = localStorage.getItem("calimeroToken");
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const dataJson = JSON.parse(localStorage.getItem("caliToken"));
  const sender = dataJson.tokenData.accountId;
  const publicKeyAsStr = bs58.encode(
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    JSON.parse(localStorage.getItem("caliToken")).walletData.publicKey.data.data
  );
  const contractAddress = "tictactoe.k.calimero.testnet";
  const networkId = "k-calimero-testnet";

  //getting private key and signer from browser localstorage
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
    nodeUrl: "",
    walletUrl: "https://localhost:1234/",
    headers: {
      "x-api-key": authToken || "",
    },
  });
  let account = new nearAPI.Account(calimeroConnection.connection, sender);
  let contract = new nearAPI.Contract(account, contractAddress, {
    viewMethods: [],
    changeMethods: ["make_a_move"],
  });
  await contract["make_a_move"](
    {
      game_id: gameId,
      selected_field: boardIndex,
    },
    new big.BN("300000000000000"),
    new big.BN("0")
  );
}

interface NewProps {
  playerB: string;
}

export async function startNewGameMethod({ playerB }: NewProps) {
  const authToken = localStorage.getItem("calimeroToken");
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const dataJson = JSON.parse(localStorage.getItem("caliToken"));
  const sender = dataJson.tokenData.accountId;
  const publicKeyAsStr = bs58.encode(
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    JSON.parse(localStorage.getItem("caliToken")).walletData.publicKey.data.data
  );
  const contractAddress = "tictactoe.k.calimero.testnet";
  const networkId = "k-calimero-testnet";

  //getting private key and signer from browser localstorage
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
    nodeUrl: "",
    walletUrl: "https://localhost:1234/",
    headers: {
      "x-api-key": authToken || "",
    },
  });
  let account = new nearAPI.Account(calimeroConnection.connection, sender);
  let contract = new nearAPI.Contract(account, contractAddress, {
    viewMethods: [],
    changeMethods: ["start_game"],
  });
  await contract["start_game"](
    {
      player_a: sender.toString(),
      player_b: playerB,
    },
    new big.BN("300000000000000"),
    new big.BN("0")
  );

  // const calimeroProvider = calimeroConnection.connection.provider;
  // // @ts-expect-error: Argument of type 'string[]' is not assignable to parameter of type 'RpcQueryRequest'
  // const accessKey = await calimeroProvider.query([
  //   `access_key/${sender}/${publicKeyAsStr}`,
  //   "",
  // ]);
  // const recentBlockHash = nearAPI.utils.serialize.base_decode(
  //   accessKey.block_hash
  // );
  // console.log(accessKey);
  // // @ts-expect-error: Property 'nonce' does not exist on type 'QueryResponseKind'
  // const nonce = ++accessKey.nonce + 1;
  // const actions = [
  //   nearAPI.transactions.functionCall(
  //     "start_game",
  //     {
  //       player_a: sender.toString(),
  //       player_b: playerB,
  //     },
  //     new big.BN("300000000000000"),
  //     new big.BN("0")
  //   ),
  // ];
  // const pK = PublicKey.fromString(publicKeyAsStr);
  // const transaction = nearAPI.transactions.createTransaction(
  //   sender,
  //   pK,
  //   contractAddress,
  //   nonce,
  //   actions,
  //   recentBlockHash
  // );
  // let serializedTx;
  // try {
  //   serializedTx = nearAPI.utils.serialize.serialize(
  //     nearAPI.transactions.SCHEMA,
  //     transaction
  //   );
  // } catch (e) {
  //   console.log("ERROR: serialization of transaction!");
  // }

  // try {
  //   calimeroSdk.signTransaction(
  //     encodeURIComponent(Buffer.from(serializedTx).toString("base64")),
  //     window.location.href
  //   );
  // } catch (e) {
  //   console.log("EXCEPTION: signing transaction failed");
  //   console.log(e);
  // }

  // const account = new nearAPI.Account(calimeroConnection.connection, sender);
  // let newKeyPair = KeyPair.fromRandom("ed25519");

  // let keystore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
  //   localStorage,
  //   "competition:"
  // );
  // keystore.setKey(networkId, sender, newKeyPair);
  // const method_names = ["make_a_move", "start_game"];
  // const allowance = nearAPI.utils.format.parseNearAmount("1");
  // const funactions = [
  //   nearAPI.transactions.addKey(
  //     newKeyPair.getPublicKey(),
  //     nearAPI.transactions.functionCallAccessKey(
  //       contractAddress,
  //       method_names,
  //       allowance
  //     )
  //   ),
  // ];
  // const transaction = nearAPI.transactions.createTransaction(
  //   sender,
  //   newKeyPair.getPublicKey(),
  //   sender,
  //   nonce,
  //   funactions,
  //   recentBlockHash
  // );
  // let serializedTx;
  // try {
  //   serializedTx = nearAPI.utils.serialize.serialize(
  //     nearAPI.transactions.SCHEMA,
  //     transaction
  //   );
  // } catch (e) {
  //   console.log("ERROR: serialization of transaction!");
  // }

  // try {
  //   calimeroSdk.signTransaction(
  //     encodeURIComponent(Buffer.from(serializedTx).toString("base64")),
  //     window.location.href
  //   );
  // } catch (e) {
  //   console.log("EXCEPTION: signing transaction failed");
  //   console.log(e);
  // }
}

export async function addFunctionKey() {
  const authToken = localStorage.getItem("calimeroToken");
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const dataJson = JSON.parse(localStorage.getItem("caliToken"));
  const sender = dataJson.tokenData.accountId;
  const publicKeyAsStr = bs58.encode(
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    JSON.parse(localStorage.getItem("caliToken")).walletData.publicKey.data.data
  );
  const contractAddress = "tictactoe.k.calimero.testnet";
  const networkId = "k-calimero-testnet";
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    signer: new InMemorySigner(keyStore),
    nodeUrl: "",
    walletUrl: "https://localhost:1234/",
    headers: {
      "x-api-key": authToken || "",
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
  console.log(accessKey);
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
  const funactions = [
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
    funactions,
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
      window.location.href
    );
  } catch (e) {
    console.log("EXCEPTION: signing transaction failed");
    console.log(e);
  }
}
