import calimeroSdk from "./calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";
import * as big from "bn.js";
import { InMemorySigner } from "near-api-js";
import { KeyPair } from "near-api-js/lib/utils";

const ACCOUNT_ID = "accountId";
const PUBLIC_KEY = "publicKey";
const contractAddress = "tictactoe.k.calimero.testnet";
const networkId = "k-calimero-testnet";

interface IProps {
  boardIndex: number;
  gameId: number;
}
export async function makeMoveMethod({ boardIndex, gameId }: IProps) {
  let sender;
  try {
    sender = localStorage.getItem(ACCOUNT_ID);
  } catch (error) {
    console.log("Error while fetching local storage.");
  }

  //1.1 Fetching keyStore saved in browserlocalstorage
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );
  //1.1. Fetching function key from keyStore
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
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/k-calimero-testnet/neard-rpc/`,
    walletUrl: "https://localhost:1234/",
    headers: {
      // @ts-expect-error: Type 'undefined' is not assignable to type 'string | number'
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY,
    },
  });
  let account = new nearAPI.Account(calimeroConnection.connection, sender);
  //init instance of Contract and call its change Method make_a_move
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
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/k-calimero-testnet/neard-rpc/`,
    walletUrl: "https://localhost:1234/",
    headers: {
      // @ts-expect-error: Type 'undefined' is not assignable to type 'string | number'
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY,
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
}

export async function addFunctionKey() {
  //Currently signed in user is "sender"
  let sender;
  let publicKeyAsStr;
  try {
    sender = localStorage.getItem(ACCOUNT_ID);
    //Fetching public key as string from wallet data
    publicKeyAsStr = bs58.encode(
      // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
      JSON.parse(localStorage.getItem(PUBLIC_KEY))
    );
  } catch (error) {
    console.log("Error while fetching local storage.");
  }

  //Fetch KeyStore from browser local storage
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  //Create connection to the network using the signer's keystore and config for your Calimero Private Shard
  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    //create new InMemorySigner using keystore
    signer: new InMemorySigner(keyStore),
    //Calimero RPC endpoint
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/k-calimero-testnet/neard-rpc/`,
    walletUrl: "https://localhost:1234/",
    headers: {
      //Auth token used to authenticate connection to calimero
      // @ts-expect-error: Type 'undefined' is not assignable to type 'string | number'
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY,
    },
  });

  const calimeroProvider = calimeroConnection.connection.provider;
  //Fetch accessKey to save latest blockchain data and nonce
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

  /*
    2. CREATE RANDOM KEYPAIR WHICH IS GOING TO BE USED AND SAVED AS A CONTRACT FUNCTION CALL KEY
  */

  //Create new random key pair
  let newKeyPair = KeyPair.fromRandom("ed25519");
  //Create new keystore for newly created key pair
  let keystore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );
  //Save key to local storage so it can be fetched later and used to sign transactions
  keystore.setKey(networkId, sender, newKeyPair);

  //Contract default config
  const method_names = ["make_a_move", "start_game"];
  //NEAR value which this key can spend
  const allowance = nearAPI.utils.format.parseNearAmount("1");
  //Create Actions array -> can batch transactions
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
  //Create transaction with provided sender, keypair, receiver and actions
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
    //Serializing transactions
    serializedTx = nearAPI.utils.serialize.serialize(
      nearAPI.transactions.SCHEMA,
      transaction
    );
  } catch (e) {
    console.log("ERROR: serialization of transaction!");
  }

  try {
    //Using CalimeroSdk function to sign transaction and openup a wallet approve request
    calimeroSdk.signTransaction(
      encodeURIComponent(Buffer.from(serializedTx).toString("base64")),
      window.location.href
    );
  } catch (e) {
    console.log("EXCEPTION: signing transaction failed");
    console.log(e);
  }

  /**
   * FINAL: After function key is added it is no longer required to approve transactions from wallet. Methods defined in actions:
   * -> start_game, make_a_move can be called without approval
   */
}
