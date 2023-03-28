import { useRouter } from "next/router";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import useNear from "../utils/useNear";
import { Near,keyStores, connect, WalletConnection } from "near-api-js";
import Mint from "@/components/Mint/Mint";
import { getConfig } from "@/utils/config";
import MyNFT from "@/components/MyNFT/mynft";
import NFTsForSell from "@/components/NFTsForSell/NFTsForSell";


export default function Home() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>("");
  const [mintVisible, setMintVisible] = useState(false);
  const [nftsVisible, setNftsVisible] = useState(false);
  const [nftsForSellVisible, setNftsForSellVisible] = useState(false);
  const [wallet, setWallet] = useState<WalletConnection>();
  
  const {
    login,
    logout,
    nearSignedIn,
    walletConn
  } = useNear();

  

  const handleMint = () => {
    setMintVisible(true);
    setNftsVisible(false);
    setNftsForSellVisible(false);
  }

  const handleNfts = () => {
    setNftsVisible(true);
    setMintVisible(false);
    setNftsForSellVisible(false);
  }

  const handleNftsForSell = () => {
    setNftsVisible(false);
    setMintVisible(false);
    setNftsForSellVisible(true);
  }
  

  useEffect(() => {
    const init = async () => {
      const nearConfig = getConfig();
      const keyStore = new keyStores.BrowserLocalStorageKeyStore()
      const near =  await connect({keyStore, ...nearConfig})
      const walletConnectionObject = new WalletConnection(near, null)
      await walletConnectionObject.isSignedInAsync()
      console.log("1");
      console.log(walletConnectionObject);
      console.log("2");
      
    };
    if (nearSignedIn) {
      init();
      setAccountId(localStorage.getItem("nearAccountId"));
    }
  }, [nearSignedIn]);

  useEffect(() => {
    const absolute = window.location.href.split("?");
    const url = absolute[0];
    router.replace(url);
  }, []);
  
  return (
    <PageWrapper
      isSignedIn={isSignedIn}
      title={translations.home.title}
      nearLogin={login}
      nearLogout={() => {
        logout();
        router.reload();
      }}
      nearSignedIn={nearSignedIn}
      mintVisible={handleMint}
      nftsVisible={handleNfts}
      nftsForSellVisible={handleNftsForSell}
    >
      {mintVisible &&
        <Mint walletConnection={walletConn}/>
      }
      {nftsVisible &&
        <MyNFT walletConnection={walletConn}/>
      }
      {nftsForSellVisible &&
        <NFTsForSell walletConnection={walletConn}/>
      }
    </PageWrapper>
  );
}
