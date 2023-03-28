import { useEffect, useState } from "react";
import CalimeroLogo from "../images/CalimeroLogo";
import translations from "../../constants/en.global.json";

interface NavigationProps {
  isSignedIn: boolean;
  nearLogin: () => void;
  nearLogout: () => void;
  nearSignedIn: boolean;
  mintVisible: () => void;
  nftsVisible: () => void;
  nftsForSellVisible: () => void;
}

export default function Navigation({
  isSignedIn,
  nearLogin,
  nearLogout,
  nearSignedIn,
  mintVisible,
  nftsVisible,
  nftsForSellVisible
}: NavigationProps) {
  const [accountId, setAccountId] = useState("");
  const [nearAccountId, setNearAccountId] = useState("");

  useEffect(() => {
    const account = localStorage.getItem("calimeroAccountId");
    setAccountId(account || "");
    const nearAccount = localStorage.getItem("nearAccountId");
    setNearAccountId(nearAccount || "");
  }, [isSignedIn, nearSignedIn]);

  return (
    <div className="flex justify-between bg-nh-bglight mb-20 p-8">
      <div className="h-full flex divide-x-2 items-center pt-2">
        <div className="pl-2 pr-4 items-center">
          <CalimeroLogo size="navbar" />
        </div>
      </div>
      <div className="flex justify-between gap-14 text-base leading-6 
              font-medium text-white items-center">
        
        <button 
          onClick={mintVisible}
          className="hover:text-nh-purple"
        >
          {translations.navigation.mint}
        </button>

        <button 
          onClick={nftsVisible}
          className="hover:text-nh-purple"
          >
            {translations.navigation.myNFTs}
        </button>

        <button 
          onClick={nftsForSellVisible}
          className="hover:text-nh-purple"
          >
            {translations.navigation.buyNFTs}
        </button>
        
      </div>
      
      {nearSignedIn ? (
        <>
          
          <div className="flex items-center gap-4">
            <label
              className="text-nh-purple text-base leading-6 
              font-medium flex items-center 
              px-2 py-4 rounded-2xl"
            >
              {nearAccountId}
            </label>
            <button
              className="bg-white roudned-lg py-3 gap-x-4 px-10 flex items-center text-nh-bglight rounded-lg hover:bg-nh-purple"
              onClick={nearLogout}
            >
              {translations.navigation.logout}
            </button>
          </div>
        </>
      ) : 
      <button
        className="bg-white roudned-lg py-3 gap-x-4 px-10 flex items-center text-nh-bglight rounded-lg hover:bg-nh-purple"
        onClick={nearLogin}
      >
        {translations.navigation.login}
      </button>
    }
    </div>
  );
}
