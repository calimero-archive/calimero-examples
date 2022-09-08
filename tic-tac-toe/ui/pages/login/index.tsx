import Head from "next/head";
import { useEffect, useState } from "react";
import MenuNavigation from "../../components/Navigation";
import calimeroSdk from "../../utils/calimeroSdk";
import * as nearAPI from "near-api-js";

export default function Login() {
  const [status, setStatus] = useState<string>("");
  const [loggedIn, setloggedIn] = useState<boolean>(false);
  const [accountSynced, setAccountSynced] = useState<boolean>(false);
  const syncNewAccount = async () => {
    calimeroSdk.syncAccount();
    getCalimeroAccount();
  };
  const signTransaction = async () => {
    return "xyz";
  };

  const getCalimeroAccount = async () => {
    const authtoken = localStorage.getItem("calimeroToken");
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    const data = JSON.parse(localStorage.getItem("caliToken"));
    let args = {
      url: "https://api.development.calimero.network/api/v1/shards/h15-calimero-testnet/neard-rpc/",
      headers: {
        "x-api-key": authtoken,
      },
    };
    console.log(data);
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
    const signer = new nearAPI.InMemorySigner(keyStore);
    const calimeroConnection = nearAPI.Connection.fromConfig({
      networkId: "h11-calimero-testnet",
      provider: { type: "JsonRpcProvider", args },
      signer: signer,
    });
    try {
      const response = await calimeroConnection.provider.query({
        request_type: "view_account",
        finality: "final",
        account_id: data.walletData.accountId,
      });
      if (response) {
        setAccountSynced(true);
      }
    } catch (error) {
      console.log(error);
      setAccountSynced(false);
    }
  };

  useEffect(() => {
    if (calimeroSdk.isSignedIn()) {
      setStatus("Logged in successfully!");
      setloggedIn(true);
      getCalimeroAccount();
    }
  });

  return (
    <div>
      <Head>
        <title>Dashboard | Calimero</title>
        <meta name="description" content="TicTacToe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuNavigation />
      <main className="h-screen w-full bg-gray-50">
        <div className=" pt-24 px-64 flex justify-between items-center">
          <div className="w-full bg-white shadow-xl rounded-xl px-8 py-4">
            <div className="flex">
              <div>
                <p className="font-inter text-2xl font-bold">
                  Login with NEAR wallet{" "}
                </p>
                <p className="font-inter text-sm mt-2">
                  Sync account will create account on Calimero Shard.
                  <br />
                  With this operation you are saving private keys on Calimero
                  Shard.
                  <br />
                  <br />
                  Instructions : After you approved wallet by clicking "Login
                  button" please click Authenticate button to finish the
                  proccess.
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="font-inter text-sm">
                  STATUS:
                  <br />
                  {status && <span className="text-green-600">{status}</span>}
                </p>
              </div>
            </div>

            <div className="mt-4 px-4 py-2 rounded-md bg-gray-50">
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p className="font-inter">Login with NEAR wallet</p>
                <button
                  type="button"
                  className={`${
                    loggedIn ? "bg-gray-400" : "bg-black"
                  } text-white h-[32px] w-[120px] text-center rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000`}
                  onClick={calimeroSdk.signIn}
                  disabled={loggedIn}
                >
                  Login
                </button>
              </div>
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p className="font-inter">Authenticate Account</p>
                <button
                  type="button"
                  className={`${
                    loggedIn ? "bg-gray-400" : "bg-black"
                  } text-white h-[32px] w-[120px] text-center rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000`}
                  onClick={calimeroSdk.authenticate}
                  disabled={loggedIn}
                >
                  Authenticate
                </button>
              </div>
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p className="font-inter">Sync account with Calimero Shard</p>
                <button
                  type="button"
                  className={`${
                    accountSynced ? "bg-gray-400" : "bg-black"
                  } text-white h-[32px] w-[120px] text-center rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000`}
                  onClick={() => syncNewAccount()}
                  disabled={accountSynced}
                >
                  Sync
                </button>
              </div>
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p className="font-inter">Sign transaction</p>
                <button
                  type="button"
                  className="bg-black text-white px-4 py-2 w-[120px] h-[34px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000"
                  onClick={() => signTransaction()}
                >
                  Sign Txn
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
