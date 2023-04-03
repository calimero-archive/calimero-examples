import { useEffect, useState } from "react";
import CalimeroLogo from "../images/CalimeroLogo";
import translations from "../../constants/en.global.json";
import Link from "next/link";

interface NavigationProps {
  isSignedIn: boolean;
  nearLogout: () => void;
  nearSignedIn: boolean;
  openMint?: boolean;
  openBuy?: boolean;
  openMyNft?: boolean;
}

export default function Navigation({
  isSignedIn,
  nearLogout,
  nearSignedIn,
  openMint,
  openBuy,
  openMyNft,
}: NavigationProps) {
  const [nearAccountId, setNearAccountId] = useState("");

  useEffect(() => {
    const nearAccount = localStorage.getItem("accountId");
    setNearAccountId(nearAccount || "");
  }, [isSignedIn, nearSignedIn]);

  return (
    <div className="flex justify-between bg-nh-bglight mb-4 p-8">
      <div className="h-full flex flex-col divide-x-2 items-center pt-2">
        <div className="pl-2 pr-4 items-center justify-center text-nh-purple font-bold">
          <Link href="/">
            <CalimeroLogo size="navbar" />
            <h1 className="flex justify-center pt-1">
              {translations.navigation.nftMarketplace}
            </h1>
          </Link>
        </div>
      </div>

      {nearSignedIn && (
        <>
          <div
            className="flex justify-between gap-14 text-base leading-6 
                  font-medium text-white items-center"
          >
            <Link
              href="/mint"
              className={`hover:text-nh-purple ${openMint && "text-nh-purple"}`}
            >
              {translations.navigation.mint}
            </Link>
            <Link
              href="/mynfts"
              className={`hover:text-nh-purple ${
                openMyNft && "text-nh-purple"
              }`}
            >
              {translations.navigation.myNFTs}
            </Link>
            <Link
              href="/buynfts"
              className={`hover:text-nh-purple ${openBuy && "text-nh-purple"}`}
            >
              {translations.navigation.buyNFTs}
            </Link>
          </div>
          <div className="flex items-center">
            <button
              className="text-nh-purple hover:text-nh-purple-highlight text-base leading-6 
              font-medium flex items-center 
              px-2 py-4 rounded-2xl"
              onClick={nearLogout}
            >
              {nearAccountId}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
