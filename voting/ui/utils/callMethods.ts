import calimeroSdk from "./calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";
import * as big from "bn.js";
import { InMemorySigner } from "near-api-js";
import { KeyPair } from "near-api-js/lib/utils";

export async function createNewVote(option: string) {
  /**
   * 1. Fetching needed data to create new Calimero connection (explained in addFunctionKey() function below.)
   */
  const authToken = localStorage.getItem("calimeroToken");
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const dataJson = JSON.parse(localStorage.getItem("caliToken"));
  const sender = dataJson.tokenData.accountId;
  const publicKeyAsStr = bs58.encode(
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    JSON.parse(localStorage.getItem("caliToken")).walletData.publicKey.data.data
  );
  const contractAddress = "voting.k.calimero.testnet";
  const networkId = "k-calimero-testnet";

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
      "x-api-key": authToken || "",
    },
  });
  //init instance of Contract and call its change Method make_a_move
  let account = new nearAPI.Account(calimeroConnection.connection, sender);
  let contract = new nearAPI.Contract(account, contractAddress, {
    viewMethods: [],
    changeMethods: ["vote"],
  });
  try {
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    await contract["vote"](
      {
        option: option,
      },
      new big.BN("300000000000000"),
      new big.BN("0")
    );
  } catch (e) {
    console.log("Account already voted!");
    console.log(e);
  }
}

export async function addFunctionKey() {
  /*
    1. GET ALL NEEDED DATA ( TOKENS, KEYS, BROWSER LOCAL STORAGE) TO CREATE CONNECTION TO CALIMERO PRIVATE SHARD
  */

  //Get authToken from localstorage -> used to authenticate user for connecting to Calimero Private Shard
  const authToken = localStorage.getItem("calimeroToken");

  //Get wallet + user data from caliToken which is created and saved to localstorage after wallet login.
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const dataJson = JSON.parse(localStorage.getItem("caliToken"));

  //Currently signed in user is "senfer"
  const sender = dataJson.tokenData.accountId;

  //Fetching public key as string from wallet data
  const publicKeyAsStr = bs58.encode(
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    JSON.parse(localStorage.getItem("caliToken")).walletData.publicKey.data.data
  );
  const contractAddress = "voting.k.calimero.testnet";
  const networkId = "k-calimero-testnet";

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
      "x-api-key": authToken || "",
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
  const method_names = ["vote"];
  //NEAR value which this key can spend
  const allowance = nearAPI.utils.format.parseNearAmount("1");
  //Create Actions array -> can batch transactions
  const actions = [
    nearAPI.transactions.addKey(
      newKeyPair.getPublicKey(),
      nearAPI.transactions.functionCallAccessKey(
        contractAddress,
        method_names,
        // @ts-expect-error: Type 'null' is not assignable to type 'BN | undefined'
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
      // @ts-expect-error:Argument of type 'Uint8Array | undefined' is not assignable to parameter of type 'WithImplicitCoercion<string>
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
