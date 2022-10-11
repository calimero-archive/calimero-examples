import calimeroSdk from "./calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";
import * as big from "bn.js";
import { InMemorySigner } from "near-api-js";
import { KeyPair } from "near-api-js/lib/utils";

export async function createNewVote(option: string) {
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
  const method_names = ["new", "vote"];
  const allowance = nearAPI.utils.format.parseNearAmount("1");
  const funactions = [
    nearAPI.transactions.addKey(
      newKeyPair.getPublicKey(),
      nearAPI.transactions.functionCallAccessKey(
        contractAddress,
        method_names,
        // @ts-expect-error: Property 'nonce' does not exist on type 'QueryResponseKind'
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
      // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
      encodeURIComponent(Buffer.from(serializedTx).toString("base64")),
      window.location.href
    );
  } catch (e) {
    console.log("EXCEPTION: signing transaction failed");
    console.log(e);
  }
}
