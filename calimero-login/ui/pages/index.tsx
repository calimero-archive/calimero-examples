import Head from "next/head";
import { useEffect, useState } from "react";
import calimeroSdk from "../utils/calimeroSdk";

export default function Login() {
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    if (calimeroSdk.isSignedIn()) {
      setUser(true);
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
      <main className="h-screen w-full bg-gray-50">
        {user ? (
          <div className="w-96 max-96">
            <button
              type="button"
              className="text-white h-[32px] w-[120px] hover:bg-[#5555FF] bg-black hover:text-white transition duration-1000"
              onClick={() => {
                calimeroSdk.signOut();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="w-96 max-96">
            <button
              type="button"
              className="text-white h-[32px] w-[120px] hover:bg-[#5555FF] bg-black hover:text-white transition duration-1000"
              onClick={() => {
                calimeroSdk.signIn();
              }}
            >
              Login
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
