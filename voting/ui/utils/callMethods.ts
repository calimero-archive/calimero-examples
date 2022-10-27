import calimeroSdk from "./calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";
import * as big from "bn.js";
import { InMemorySigner } from "near-api-js";
import { KeyPair } from "near-api-js/lib/utils"

export const ACCOUNT_ID = "accountId";
const PUBLIC_KEY = "publicKey";
const MAX_GAS = "300000000000000";
let networkId: string;
let contractAddress: string;

if (
  process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID &&
  process.env.NEXT_PUBLIC_CALIMERO_CONTRACT_ADDRESS
) {
  networkId = process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID;
  contractAddress = process.env.NEXT_PUBLIC_CALIMERO_CONTRACT_ADDRESS;
}

export async function createNewVote(option: string) {
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
 
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );
  // @ts-ignore: nextline - xy is not assignable to parameter of type yx
  let keyPair = await keyStore.getKey(networkId, sender);
  const signer = await nearAPI.InMemorySigner.fromKeyPair(
    networkId,
    // @ts-ignore: nextline - xy is not assignable to parameter of type yx
    sender,
    keyPair
  );

  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    signer: signer,
    nodeUrl: `${process.env.NEXT_PUBLIC_CALIMERO_NODE_URL}/${contractAddress}/neard-rpc/`,
    walletUrl: process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL,
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_CALIMERO_X_API_HEADER_KEY || "",
    },
  });
  // @ts-ignore: nextline - xy is not assignable to parameter of type yx
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
      MAX_GAS,
      new big.BN("0")
    );
  } catch (e) {
    console.log("Account already voted!");
    console.log(e);
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
  console.log(recentBlockHash);
  // @ts-ignore
  const nonce = ++accessKey.nonce + 1;

  let newKeyPair = KeyPair.fromRandom("ed25519");
  let keystore = new nearAPI.keyStores.BrowserLocalStorageKeyStore(
    localStorage,
    "competition:"
  );
  // @ts-ignore: nextline - xy is not assignable to parameter of type yx
  keystore.setKey(networkId, sender, newKeyPair);

  const method_names = ["vote"];
  const actions = [
    nearAPI.transactions.addKey(
      newKeyPair.getPublicKey(),
      nearAPI.transactions.functionCallAccessKey(
        contractAddress,
        method_names,
        new big.BN("10000000")
      )
    ),
  ];

  const transaction = nearAPI.transactions.createTransaction(
    // @ts-ignore: nextline - xy is not assignable to parameter of type yx
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
      // @ts-ignore: nextline - xy is not assignable to parameter of type yx
      encodeURIComponent(Buffer.from(serializedTx).toString("base64")),
      window.location.href
    );
  } catch (e) {
    console.log(e);
  }
}
