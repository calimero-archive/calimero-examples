import React, { useEffect, useState } from "react";
import { WalletConnection, keyStores, connect, Contract } from "near-api-js";

export default function NearPage() {
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState("");

  async function login() {
    setLoading(true);

    const nearConfig = {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      contractName: "tictactoe.igi.testnet",
      walletUrl: "https://testnet-calimero-mnw.netlify.app/",
    };

    const connectionConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(), // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet-calimero-mnw.netlify.app/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await connect(connectionConfig);
    const wallet = new WalletConnection(nearConnection, nearConfig.contractName);

    try {
      await wallet.requestSignIn({ contractId: nearConfig.contractName, methodNames: ["register_player"]});
      setAccountId(wallet.getAccountId());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    const x = async() =>{
        const nearConfig = {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      contractName: "tictactoe.igi.testnet",
      walletUrl: "https://testnet-calimero-mnw.netlify.app/",
    };

    const connectionConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(), // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet-calimero-mnw.netlify.app/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await connect(connectionConfig);
    const wallet = new WalletConnection(nearConnection, nearConfig.contractName);
    console.log(wallet.isSignedIn());
    }
    x()
  })
  const register = async () => {
    const nearConfig = {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      contractName: "tictactoe.igi.testnet",
      walletUrl: "https://testnet-calimero-mnw.netlify.app/",
    };

    const connectionConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(), // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet-calimero-mnw.netlify.app/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await connect(connectionConfig);
    const wallet = new WalletConnection(nearConnection, nearConfig.contractName);
    const contract = new Contract(
        wallet.account(), // the account object that is connecting
        "tictactoe.igi.testnet",
        {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["register_player"], // change methods modify state
        }
    );
    const res = await contract["register_player"]({},"300000000000000");
    console.log(res);
  }
  return (
    <div>
      {accountId ? (
        <p>Logged in as {accountId}</p>
      ) : (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
             <button onClick={login} className="px-10 py-10 bg-green-200">Login with NEAR Wallet</button>
            <button onClick={register} className="px-10 py-2 bg-red-500">REGISTER GAME</button>
            </>
          )}
        </>
      )}
    </div>
  );
  
}
