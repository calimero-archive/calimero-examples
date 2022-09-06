import Head from "next/head";
import { useEffect, useState } from "react";
import LoginComponent from "../../components/dashboard/LoginComponent";
import OpenGamesList from "../../components/dashboard/OpenGameList";
import MenuNavigation from "../../components/Navigation";
import calimeroSdk from "../../utils/calimeroSdk";

export default function Dashboard() {
  const [logged, setLogged] = useState<boolean>(false);
  useEffect(() => {
    const loggedIn = calimeroSdk.isSignedIn();
    if (loggedIn) {
      setLogged(true);
    } else {
      setLogged(false);
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
      <main className="h-screen w-full ">
        <div className=" pt-24 px-64 flex justify-between items-center">
          <div className="text-2xl font-bold ">
            <p>TIC-TAC-TOE - Current Games</p>
          </div>
        </div>
        <div className="mt-1">
          {logged ? (
            <div>
              <OpenGamesList />
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
