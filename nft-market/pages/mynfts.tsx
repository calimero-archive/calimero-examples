import NFT from "../components/nft/NFT";
import { NFTProps } from "../components/nft/NFT";
import { displayAllNFT } from "@/utils/mint";
import { useState, useEffect } from "react";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import * as nearAPI from "near-api-js";
import { config } from "../utils/calimeroSdk";
import translations from "../constants/en.global.json";
import { useRouter } from "next/router";
import PageWrapper from "@/components/pageWrapper/PageWrapper";

let walletConnectionObject: WalletConnection | undefined = undefined;

interface MyNFTProps {
  walletConnection: WalletConnection | undefined;
}

interface MyContract extends nearAPI.Contract {
  storage_deposit(options: any, gas: number, amount: string): Promise<any>;
}

export default function MyNFT({ walletConnection }: MyNFTProps) {
  const [nfts, setNfts] = useState<NFTProps[]>([]);
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

  const depositStorage = async () => {
    if (walletConnectionObject) {
      const contract = new nearAPI.Contract(
        walletConnectionObject.account(),
        config.marketContract,
        {
          changeMethods: ["storage_deposit"],
          viewMethods: [],
        }
      ) as MyContract;
      try {
        const res = await contract["storage_deposit"](
          {},
          30000000000000, // attached gas
          nearAPI.utils.format.parseNearAmount("1") ?? "1"
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

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
      <div className="flex items-center justify-end gap-2 mb-4">
        <h1 className="text-white">{translations.mynft.depositText}</h1>
        <button
          className="bg-white hover:bg-nh-purple  p-2 text-black rounded"
          onClick={depositStorage}
        >
          {translations.mynft.deposit}
        </button>
      </div>
      <div className="w-full h-scree grid grid-cols-3 gap-8 mb-20">
        {nfts.map((nft) => {
          return (
            <NFT
              key={nft.token_id}
              metadata={nft.metadata}
              owner_id={nft.owner_id}
              token_id={nft.token_id}
              walletConnection={walletConnectionObject}
              sellOrBid={true}
              sale_conditions={nft.sale_conditions}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
}
