import NFT from "../components/nft/NFT";
import { NFTProps } from "../components/nft/NFT";
import { useState, useEffect } from "react";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import { useRouter } from "next/router";
import PageWrapper from "@/components/pageWrapper/PageWrapper";
let walletConnectionObject: WalletConnection | undefined = undefined;
import translations from "../constants/en.global.json";

interface NFTsForSellProps {
  walletConnection: WalletConnection | undefined;
}

export default function NFTsForSell({ walletConnection }: NFTsForSellProps) {
  const [nftsForSell, setNftsForSell] = useState<NFTProps[]>([]);
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
      loadSaleItems();
    };
    init();
  }, []);

  const loadSaleItems = async () => {
    if (walletConnectionObject) {
      let nftTokens = await walletConnectionObject
        .account()
        .viewFunction(config.nftContract, "nft_tokens", {
          from_index: "0",
          limit: 64,
        });
      let saleTokens = await walletConnectionObject
        .account()
        .viewFunction(config.marketContract, "get_sales_by_nft_contract_id", {
          nft_contract_id: config.nftContract,
          from_index: "0",
          limit: 64,
        });
      let sales = [];
      for (let i = 0; i < nftTokens.length; i++) {
        const { token_id } = nftTokens[i];
        let saleToken = saleTokens.find(
          ({ token_id: t }: { token_id: string }) => t === token_id
        );
        if (saleToken !== undefined) {
          sales[i] = Object.assign(nftTokens[i], saleToken);
        }
      }
      setNftsForSell(sales);
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
      openBuy={true}
    >
      <div className="w-full h-scree grid grid-cols-3 gap-8">
        {nftsForSell.map((nft) => {
          return (
            <NFT
              key={nft.token_id}
              metadata={nft.metadata}
              owner_id={nft.owner_id}
              token_id={nft.token_id}
              walletConnection={walletConnectionObject}
              sellOrBid={false}
              sale_conditions={nft.sale_conditions}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
}
