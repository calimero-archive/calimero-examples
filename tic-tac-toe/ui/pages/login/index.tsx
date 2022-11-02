import Head from "next/head";
import { useEffect, useState } from "react";
import MenuNavigation from "../../components/Navigation";
import calimeroSdk from "../../utils/calimeroSdk";
import { addFunctionKey } from "../../utils/callMethods";

export default function Login() {
  const [status, setStatus] = useState<string>("");
  const [loggedIn, setloggedIn] = useState<boolean>(false);

  const signMessage = async () => {
    await calimeroSdk.signMessage();
  };
  useEffect(() => {
    if (calimeroSdk.isSignedIn()) {
      setStatus("SUCCESS!");
      setloggedIn(true);
    } else {
      const res = calimeroSdk.setCredentials();
    }
  }, []);

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
            <div className="flex justify-between items-center">
              <div>
                <p className=" text-2xl font-bold">Login with NEAR wallet </p>
                <p className=" text-sm mt-4 mb-8">
                  SignIn option will connect to Calimero private shard and sync
                  accounts
                  <br />
                </p>
              </div>
              <div className="pr-32">
                <p>
                  Sign in status:{" "}
                  <span className="text-green-600">{status}</span>
                </p>
              </div>
            </div>
            <div className="my-10 px-8 py-8 rounded-md bg-gray-50 text-tiny font-medium">
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p>Login with NEAR wallet</p>
                <button
                  type="button"
                  className={`${
                    loggedIn ? "bg-gray-400" : "bg-black"
                  } text-white h-[32px] w-[120px] rounded-md  hover:bg-[#5555FF] hover:text-white transition duration-1000`}
                  onClick={() => {
                    calimeroSdk.signIn();
                  }}
                  disabled={loggedIn}
                >
                  Login
                </button>
              </div>
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p>Sign message</p>
                <button
                  type="button"
                  className="bg-black text-white px-4 w-[120px] h-[34px] rounded-md hover:bg-[#5555FF] hover:text-white transition duration-1000"
                  onClick={() => signMessage()}
                >
                  Sign msg
                </button>
              </div>
              <div className="flex justify-between items-center gap-x-10 mt-4">
                <p>Add function key for starting games and making moves</p>
                <button
                  type="button"
                  className={`bg-black text-white px-4 w-[120px] h-[34px] rounded-md hover:bg-[#5555FF] hover:text-white transition duration-1000`}
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
