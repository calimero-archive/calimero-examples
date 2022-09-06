import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Board from "../components/Board";
import MenuNavigation from "../components/Navigation";
import calimeroSdk from "../utils/calimeroSdk";
import nearAPI from "near-api-js";
import * as bs58 from "bs58";
import * as big from "bn.js";
import { PublicKey } from "near-api-js/lib/utils";
import { post } from "../utils/request";

// export const networkId = "hackathon-calimero-testnet";
// export async function sendTransaction() {
//   const header = localStorage.getItem("calimeroToken")
//     ? localStorage.getItem("calimeroToken")
//     : "";
//   const calimeroProvider = (
//     await nearAPI.connect({
//       nodeUrl: `https://api.development.calimero.network/api/v1/shards/${networkId}/neard-rpc`,
//       networkId: networkId,
//       deps: {
//         keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
//       },
//       headers: {
//         // @ts-expect-error: parsing null
//         "x-api-key": localStorage.getItem("calimeroToken"),
//       },
//     })
//   ).connection.provider;

//   let localToken =
//     localStorage.getItem("caliToken") !== null
//       ? localStorage.getItem("caliToken")
//       : "x";
//   // @ts-expect-error: parsing null
//   const token = JSON.parse(localToken);
//   console.log(localStorage.getItem("calimeroToken"));
//   console.log(token);
//   let sender = token.tokenData.accountId;
//   let receiver = "tictactoe.hackathon.calimero.testnet"; // TODO make configurable
//   // gets sender's public key
//   const publicKeyAsStr = bs58.encode(token.walletData.publicKey.data.data);

//   console.log(publicKeyAsStr);
//   console.log("TEST");

//   // gets sender's public key information from NEAR blockchain
//   // @ts-expect-error:
//   const accessKey = await calimeroProvider.query([
//     `access_key/${sender}/${publicKeyAsStr}`,
//     "",
//   ]);

//   // constructs actions that will be passed to the createTransaction method below
//   const actions = [
//     nearAPI.transactions.functionCall(
//       "num_of_games",
//       {},
//       new big.BN("300000000000000"),
//       new big.BN("0")
//     ),
//   ];

//   // converts a recent block hash into an array of bytes
//   // this hash was retrieved earlier when creating the accessKey (Line 26)
//   // this is required to prove the tx was recently constructed (within 24hrs)
//   const recentBlockHash = nearAPI.utils.serialize.base_decode(
//     accessKey.block_hash
//   );

//   console.log("RCH: " + recentBlockHash);
//   // each transaction requires a unique number or nonce
//   // this is created by taking the current nonce and incrementing it
//   // @ts-expect-error:
//   const nonce = ++accessKey.nonce + 1;

//   console.log("NONCE " + nonce);

//   // create transaction
//   const transaction = nearAPI.transactions.createTransaction(
//     sender,
//     PublicKey.fromString(publicKeyAsStr),
//     receiver,
//     nonce,
//     actions,
//     recentBlockHash
//   );
//   console.log(transaction);

//   let serializedTx;
//   try {
//     serializedTx = nearAPI.utils.serialize.serialize(
//       nearAPI.transactions.SCHEMA,
//       transaction
//     );
//     console.log(serializedTx);
//   } catch (e) {
//     console.log("ERROR");
//   }
//   try {
//     // This always redirects, but sometimes fails
//     calimeroSdk.signTransaction(Buffer.from(serializedTx).toString("base64"));
//   } catch (e) {
//     console.log("EXCEPTION");
//     console.log(e);
//   }
// }
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
    const res = await post("/api/methods/startGame", data);
    if (res.success) {
      console.log(res.game_id);
      localStorage.setItem("gameId", res.game_id);
      setGameId(res.game_id);
    }
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
