import { WalletConnection } from "near-api-js";
import { useEffect, useState } from "react";
import CalimeroLogo from "../images/CalimeroLogo";
import TictactoeLogo from "../images/TictactoeLogo";
import * as nearAPI from "near-api-js";

interface NavigationProps {
  walletConnection?: WalletConnection;
}

export default function Navigation({ walletConnection }: NavigationProps) {
  const [accountId, setAccountId] = useState("");

  const addFunctionkey = async () => {
    //@ts-ignore
    await walletConnection.addFunctionKey(
      "tictactoe.fran.calimero.testnet",
      ["make_a_move", "start_game"],
      nearAPI.utils.format.parseNearAmount("1"),
      localStorage.getItem("calimeroToken")
    );
  };

  useEffect(() => {
    if (localStorage) {
      setAccountId(localStorage.getItem("accountId") || "");
    }
  });
  return (
    <div className="flex justify-between">
      <div className="h-full bg-nh-bglight flex divide-x-2">
        <div className="pl-2 pr-4">
          <CalimeroLogo size="navbar" />
        </div>
        <div className="pt-2 pl-5">
          <TictactoeLogo size="navbar" />
        </div>
      </div>
      {accountId && (
        <>
          <div
            className="bg-white text-sm font-medium text-black rounded-lg px-4 h-8 mt-2 flex items-center justify-center hover:bg-nh-purple cursor-pointer"
            onClick={addFunctionkey}
          >
            Add Function Key
          </div>
          <div
            className="text-white hover:text-nh-purple text-base leading-6 
        font-medium flex items-center cursor-pointer"
            onClick={() => walletConnection?.signOut()}
          >
            {accountId}
          </div>
        </>
      )}
    </div>
  );
}
