import {CalimeroSdk, CalimeroToken, WalletData} from "calimero-auth-sdk";
import {PublicKey} from "near-api-js/lib/utils";
import * as nearAPI from "near-api-js";
import bs58 from 'bs58';

const BASE_ENDPOINT = "https://api.development.calimero.network/";
const selectedShardId = 'hackathon-calimero-testnet'; // TODO make configurable

const shardId = selectedShardId;
const networkId = selectedShardId;

export function getCalimeroSdk() {
  return CalimeroSdk.init({
    shardId: shardId,
    walletUrl: "https://localhost:1234",
    calimeroUrl: "https://api.development.calimero.network",
    calimeroWebSdkService: "https://api.development.calimero.network",
  });
};

async function getProvider(token: string) {
  const near = await connectToNear(token);
  return near.connection.provider;
}

async function connectToNear(token: string) {
  return await nearAPI.connect({
    nodeUrl: `${ BASE_ENDPOINT }api/v1/shards/${ shardId }/neard-rpc`,
    networkId: networkId,
    deps: {
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
    },
    headers: {
      "x-api-key": token
    },
  });
}

export async function sendTransaction() {
  let savedToken = localStorage.getItem('calimeroToken');
  console.log("saved token", savedToken);

  if (!savedToken) {
    console.log("unathorizedl");
    throw new Error("unathorized");
  }

  const calimeroProvider = await getProvider(savedToken);
  const token = JSON.parse(savedToken);
  console.log("token", token);
  let sender = token.tokenData.accountId;
  let receiver = 'voting.hackathon.calimero.testnet'; // TODO make configurable
  // gets sender's public key
  const publicKeyAsStr = bs58.encode(token.walletData.publicKey.data.data);

  console.log(publicKeyAsStr);
  console.log("TEST");

  // gets sender's public key information from NEAR blockchain
  let rpc = {
    public_key: `access_key/${ sender }/${ publicKeyAsStr }`,
    access_key: ""
  };

  const accessKey = await calimeroProvider.query(`access_key/${ sender }/${ publicKeyAsStr }`, "");

  console.log(accessKey);

  // constructs actions that will be passed to the createTransaction method below
  const actions = [nearAPI.transactions.functionCall(
    'get_poll',
    {},
    BigInt('300000000000000'),
    BigInt('0')
  )];

  // converts a recent block hash into an array of bytes
  // this hash was retrieved earlier when creating the accessKey (Line 26)
  // this is required to prove the tx was recently constructed (within 24hrs)
  const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);

  console.log("RCH: " + recentBlockHash);
  // each transaction requires a unique number or nonce
  // this is created by taking the current nonce and incrementing it
  // const nonce = ++accessKey.nonce + 1;

  // console.log("NONCE " + nonce);

  // // create transaction
  // const transaction = nearAPI.transactions.createTransaction(
  //   sender,
  //   PublicKey.fromString(publicKeyAsStr),
  //   receiver,
  //   nonce,
  //   actions,
  //   recentBlockHash
  // );
  // console.log("PROSAO");
  // console.log(transaction);


  // let serializedTx;
  // try {
  //   serializedTx = nearAPI.utils.serialize.serialize(
  //     nearAPI.transactions.SCHEMA,
  //     transaction
  //   );
  //   console.log(serializedTx);
  // } catch (e) {
  //   console.log("ERROR");
  // }
  // try {

  //   // This always redirects, but sometimes fails
  //   getCalimeroSdk().signTransaction(Buffer.from(serializedTx).toString('base64'));
  // } catch (e) {
  //   console.log("EXCEPTION");
  //   console.log(e);
  // }
}