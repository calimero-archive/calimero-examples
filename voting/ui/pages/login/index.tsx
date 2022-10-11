import Head from "next/head";
import { useEffect, useState } from "react";
import MenuNavigation from "../../components/Navigation";
import calimeroSdk from "../../utils/calimeroSdk";
import * as nearAPI from "near-api-js";
import { addFunctionKey } from "../../utils/callMethods";

export default function Login() {
  const [status, setStatus] = useState<string>("");
  const [loggedIn, setloggedIn] = useState<boolean>(false);
  const [accountSynced, setAccountSynced] = useState<boolean>(false);
  const [txnSigned, setTxnSigned] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string | null>("");
  const [currentTxn, setCurrentTxn] = useState<boolean>(false);

  const signMessage = async () => {
    await calimeroSdk.signMessage();
    localStorage.setItem("MessageSign", "True");
    setCurrentTxn(true);
  };

  const syncNewAccount = async () => {
    calimeroSdk.syncAccount();
    await getCalimeroAccount();
    window.location.reload();
  };
  useEffect(() => {
    setTxnSigned(false);
    setErrorCode("");
    if (localStorage.getItem("MessageSign")) {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const errorCode = params.get("error");
      if (!errorCode) {
        setTxnSigned(true);
        setCurrentTxn(true);
        localStorage.setItem("MessageSign", "true");
      } else {
        localStorage.setItem("MessageSign", "");
        setCurrentTxn(true);
        setErrorCode(errorCode);
      }
    }
  }, []);

  const getCalimeroAccount = async () => {
    const authtoken = localStorage.getItem("calimeroToken");
    // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
    const data = JSON.parse(localStorage.getItem("caliToken"));
    let args = {
      url: "development calimero url ",
      headers: {
        "x-api-key": authtoken,
      },
    };
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
    const signer = new nearAPI.InMemorySigner(keyStore);
    const calimeroConnection = nearAPI.Connection.fromConfig({
      networkId: "k-calimero-testnet",
      provider: { type: "JsonRpcProvider", args },
      signer: signer,
    });
    localStorage.setItem("account_id", data.walletData.accountId);
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
                {currentTxn && !errorCode && (
                  <p>
                    <span className="text-green-600">
                      Message Signed successfully
                    </span>
                  </p>
                )}
                {errorCode && (
                  <>
                    <p>
                      error code:
                      <br />
                      {status && (
                        <span className="text-red-600">{errorCode}</span>
                      )}
                    </p>
                  </>
                )}
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
                  onClick={() => {
                    calimeroSdk.signIn();
                  }}
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
                  className={`${
                    txnSigned ? "bg-gray-400" : "bg-black"
                  } text-white px-4 py-2 w-[120px] h-[34px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000`}
                  onClick={() => signMessage()}
                  disabled={txnSigned}
                >
                  Sign Message
                </button>
              </div>
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p className="font-inter">
                  Add function key for starting games and making moves
                </p>
                <button
                  type="button"
                  className={`bg-black text-white px-4 py-2 w-[120px] h-[34px] rounded-md text-tiny font-medium font-inter hover:bg-[#5555FF] hover:text-white transition duration-1000`}
                  onClick={() => addFunctionKey()}
                >
                  Add Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
