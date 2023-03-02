import { WalletConnection } from "near-api-js";
import { useEffect, useState } from "react";
import CalimeroLogo from "../images/CalimeroLogo";
import TictactoeLogo from "../images/TictactoeLogo";
import * as nearAPI from "near-api-js";
import translations from "../../../constants/en.global.json";

interface NavigationProps {
  isSignedIn: boolean;
  signOut: () => void;
}

export default function Navigation({ isSignedIn, signOut}: NavigationProps) {
  const [accountId, setAccountId] = useState("");

  useEffect(()=>{
    const account = localStorage.getItem("accountId");
    setAccountId(account || "");
  },[isSignedIn]);

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
      {isSignedIn && (
          <div
            className="text-white hover:text-nh-purple text-base leading-6 
        font-medium flex items-center cursor-pointer"
            onClick={signOut}
          >
            {accountId}
          </div>
      )}
    </div>
  );
}
