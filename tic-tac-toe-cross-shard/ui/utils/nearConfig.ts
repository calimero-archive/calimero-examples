import * as nearAPI from "near-api-js";

export const connectionConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  walletUrl: "https://calimero-wallet.netlify.app",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};