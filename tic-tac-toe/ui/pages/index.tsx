import type { NextPage } from "next";
import Head from "next/head";
import Board from "../components/Board";
import MenuNavigation from "../components/Navigation";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Tic Tac Toe | Calimero</title>
        <meta name="description" content="TicTacToe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuNavigation />
      <main className="h-screen w-full ">
        <div className=" pt-24 px-64 flex justify-start items-center">
          <div className="text-2xl font-bold ">
            <p>TIC-TAC-TOE - Retro game on NEAR x Calimero</p>
          </div>
        </div>
        <div className="mt-1 mb-2 border-bg-black border-bg-opacity-70  border border-b-1 mx-64"></div>
        <div className="flex justify-center items-center mt-8">
          <div className="bg-gray-50 w-1/3 px-12 py-10 rounded-xl shadow-md font-inter">
            <Board />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
