import NFT from "../components/nft/Nft";
import { NFTProps } from "../components/nft/Nft";
import { displayAllNFT } from "@/utils/mint";
import { useState, useEffect } from "react";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import * as nearAPI from "near-api-js";
import { config } from "../utils/calimeroSdk";
import translations from "../constants/en.global.json";
import { useRouter } from "next/router";
import PageWrapper from "@/components/pageWrapper/PageWrapper";
import DepositDialog from "@/components/depositDialog/DepositDialog";
import NftsContainer from "@/components/nftsContainer/NftsContainer";

let walletConnectionObject: WalletConnection | undefined = undefined;

interface MyNFTProps {
  walletConnection: WalletConnection | undefined;
}

export default function MyNFT({ walletConnection }: MyNFTProps) {
  const [nfts, setNfts] = useState<NFTProps[]>([]);
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [deposit, setDeposit] = useState(false);

  const handleClose = () => {
    setDeposit(false);
  };

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
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(
        calimero,
        config.nftContract
      );
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = walletConnectionObject?.account();
      if (account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
      const nfts = await displayAllNFT(walletConnectionObject);
      setNfts(nfts);
    };
    init();
  }, []);

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
      openMyNft={true}
    >
      <div className="flex items-center justify-end mb-4">
        <button
          className="bg-white hover:bg-nh-purple p-2 text-black rounded"
          onClick={async () => {
            setDeposit(true);
          }}
        >
          {translations.mynft.read}
        </button>
      </div>
      <NftsContainer
        nfts={nfts}
        sellOrBuy={true}
        walletConnectionObject={walletConnectionObject}
      />
      {deposit && (
        <DepositDialog
          walletConnectionObject={walletConnectionObject}
          onClose={handleClose}
        />
      )}
    </PageWrapper>
  );
}
