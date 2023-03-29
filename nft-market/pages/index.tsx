import { useRouter } from "next/router";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import Mint from "@/components/Mint/Mint";
import MyNFT from "@/components/MyNFT/mynft";
import NFTsForSell from "@/components/NFTsForSell/NFTsForSell";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";

let walletConnectionObject: WalletConnection | undefined = undefined;

export default function Home() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>("");
  const [mintVisible, setMintVisible] = useState(false);
  const [nftsVisible, setNftsVisible] = useState(false);
  const [nftsForSellVisible, setNftsForSellVisible] = useState(false);
  
  const login = async () => {
    try {
        await walletConnectionObject?.requestSignIn({
        contractId: config.nftContract,
      });
    } catch (error) {
       console.log(error);
    }
    
   
    
  };

  const logout = () => {
    walletConnectionObject?.signOut();
    setIsSignedIn(false);
  };

  useEffect(() => {
    if (isSignedIn && localStorage.getItem("accountId")) {
      setAccountId(localStorage.getItem("accountId"));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, config.nftContract);
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = walletConnectionObject?.account();
      if (account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
    };
    init();
  }, []);

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
      nearSignedIn={isSignedIn}
      mintVisible={handleMint}
      nftsVisible={handleNfts}
      nftsForSellVisible={handleNftsForSell}
    >
      {mintVisible &&
        <Mint walletConnection={walletConnectionObject}/>
      }
      {nftsVisible &&
        <MyNFT walletConnection={walletConnectionObject}/>
      }
      {nftsForSellVisible &&
        <NFTsForSell walletConnection={walletConnectionObject}/>
      }
    </PageWrapper>
  );
}
