import Head from "next/head";
import { useEffect, useState } from "react";
import LoginComponent from "../components/dashboard/LoginComponent";
import MenuNavigation from "../components/Navigation";
import VotingComponent from "../components/voting/VotingComponent";
import calimeroSdk from "../utils/calimeroSdk";

export default function Dashboard() {
  const [logged, setLogged] = useState<boolean>(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    calimeroSdk.isSignedIn() ? setLogged(true) : setLogged(false);
  });
  return (
    <div>
      <Head>
        <title>Dashboard | Calimero</title>
        <meta name="description" content="TicTacToe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuNavigation />
      <main className="h-screen w-full ">
        <div className=" pt-24 px-32 flex justify-between items-center">
          <div className="text-5xl font-bold ">
            <p>Voting Smart Contract</p>
          </div>
        </div>
        <div className="mt-1">
          {logged ? (
            <div>
              <VotingComponent />
            </div>
          ) : (
            <div>
              <LoginComponent />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
