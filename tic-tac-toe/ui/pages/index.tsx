 // @ts-nocheck

import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Board from "../components/Board";
import MenuNavigation from "../components/Navigation";
import calimeroSdk from "../utils/calimeroSdk";
import * as nearAPI from "near-api-js";
import bs58 from "bs58";

import { Contract, InMemorySigner } from "near-api-js";
import {
  MAX_GAS,
} from "../utils/contractUtils";
import { CalimeroSdk } from "calimero-auth-sdk";

export async function startGameMethod() {
   // get from localStorage.getItem("calimeroToken"); and pass here in the body
  const authToken = localStorage.getItem("calimeroToken");
   // get from localStorage.getItem("caliToken"); and pass here in the body
  const sender = JSON.parse(localStorage.getItem("caliToken") || "").tokenData.accountId;
  const publicKeyAsStr = bs58.encode(JSON.parse(localStorage.getItem("caliToken") || "").walletData.publicKey.data.data);

  const contractAddress = "tictactoe.h15-calimero-testnet.calimero.testnet";
  const networkId = "h11-calimero-testnet";
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
 
  
  const calimeroConnection = await nearAPI.connect({
    networkId: networkId,
    keyStore: keyStore,
    signer: new InMemorySigner(keyStore),
    nodeUrl: "https://api.development.calimero.network/api/v1/shards/h15-calimero-testnet/neard-rpc/",
    walletUrl: "http://localhost:1234/",
    headers: {
      "x-api-key": authToken || "",
    }
  });
  const calimeroProvider = calimeroConnection.connection.provider;

  const accessKey = await calimeroProvider.query([`access_key/${sender}/${publicKeyAsStr}`, '']);
  console.log(accessKey);

  const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);
  console.log(recentBlockHash);

  const nonce = ++accessKey.nonce + 1;
  console.log(nonce);

  /*
  const actions = [nearAPI.transactions.functionCall(
    'get_poll',
    {},
    new big.BN('300000000000000'),
    new big.BN('0')
  )];
  */



    /*
  keyStore
  nearAPI.transactions.createTransaction(
    sender,
    pubKey,
    contractAddress,


  )

  calimeroSdk.signTransaction()

  let keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  let functionCallResult = await walletConnection.account().functionCall({
    contractId: contractAddress,
    methodName: 'start_game',
    args: { player_a: "chefsale.testnet",  player_b: "chefsale.testnet"},
    gas: MAX_GAS, // optional param, by the way
    attachedDeposit: 0,
    walletMeta: "sadsa=ksoadskopdksapdsa",
    walletCallbackUrl: 'http://localhost:3000' // optional param, by the way
  });
  console.log(functionCallResult);
  */
}

const Home: NextPage = () => {
  const [showSync, setShowSync] = useState<boolean>(false);
  const [signTxn, setSignTxn] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string>("");
  useEffect(() => {
    if (calimeroSdk.isSignedIn()) {
      if (!signTxn) {
        setShowSync(true);
      }
    } else {
      setShowSync(false);
    }
    if (localStorage.getItem("gameId")) {
      // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
      setGameId(localStorage.getItem("gameId"));
    }
  });
  const syncCaliAccount = () => {
    setShowSync(false);
    setSignTxn(true);
    console.log("promjeni me ");
    calimeroSdk.syncAccount();
    console.log(showSync);
    console.log(signTxn);
  };
  const signTransaction = () => {
    return;
  };

  const startNewGame = async () => {
    const data = {
      playerA: "igi.hackathon.calimero.testnet",
      playerB: "miki.hackathon.calimero.testnet",
    };
    const contract = await startGameMethod();
    console.log(contract);

    /*
    if (res.success) {
      console.log(res.game_id);
      localStorage.setItem("gameId", res.game_id);
      setGameId(res.game_id);
    }
    */
  };

  return (
    <div>
      <Head>
        <title>Tic Tac Toe | Calimero</title>
        <meta name="description" content="TicTacToe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuNavigation />
      <main className="h-screen w-full ">
        <div className=" pt-24 px-64 flex justify-between items-center">
          <div className="text-2xl font-bold ">
            <p>TIC-TAC-TOE - Retro game on NEAR x Calimero</p>
          </div>
          {showSync && !signTxn && (
            <div className="flex justify-center items-center gap-x-2">
              <p className="text-xs">sync account with Calimero</p>
              <button
                type="button"
                className="bg-black text-white px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
                onClick={() => syncCaliAccount()}
              >
                Sync
              </button>
            </div>
          )}
          {!showSync && signTxn && (
            <div className="flex justify-center items-center gap-x-2">
              <p className="text-xs">Sign transaction</p>
              <button
                type="button"
                className="bg-black text-white px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
                onClick={() => signTransaction()}
              >
                Sign Txn
              </button>
            </div>
          )}
        </div>
        <div className="mt-1 mb-2 border-bg-black border-bg-opacity-70  border border-b-1 mx-64"></div>
        <div className="flex justify-center items-center mt-8">
          <div className="w-full grid grid-cols-3">
            <div className="col-span-1"></div>
            <div className="col-span-1 px-12 py-10 rounded-xl shadow-md font-inter">
              <Board gameId={gameId} setGameId={setGameId} />
            </div>

            <div className="col-span-1 px-4 py-4 ">
              <button
                className="bg-black text-white px-4 py-2 flex items-center h-[32px] rounded-md text-tiny font-medium font-inter hover:bg-[#55ff9c] hover:text-black transition duration-1000"
                onClick={() => startNewGame()}
              >
                Start New Game
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
