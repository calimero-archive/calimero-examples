import translations from "../../constants/en.global.json";
import { WalletConnection } from "calimero-sdk";
import { useState } from "react";
import NearLogo from "../images/NearLogo";
import { config } from "../../utils/calimeroSdk";
import { useRouter } from "next/router";
import SellNftDialog from "../sellNftDialog/SellNftDialog";
import CantBuyYourOwnNftDialog from "../cantBuyYourOwnNftDialog/CantBuyYourOwnNftDialog";

interface Metadata {
  description: string;
  media: string;
  title: string;
}

export interface NFTProps {
  metadata: Metadata;
  owner_id: string;
  token_id: string;
  sale_conditions?: string;
  walletConnection: WalletConnection | undefined;
  sellOrBid: boolean;
}

export default function NFT({
  metadata,
  owner_id,
  token_id,
  sale_conditions,
  walletConnection,
  sellOrBid,
}: NFTProps) {
  const router = useRouter();
  const [sellNft, setSellNft] = useState(false);
  const [yourOwnNft, setYourOwnNft] = useState(false);

  const checkSellerIsOwner = () => {
    if (!sellOrBid) {
      if (owner_id === walletConnection?._authData.accountId) {
        return true;
      }
      return false;
    }
  };

  const handleClose = () => {
    setSellNft(false);
    setYourOwnNft(false);
  };

  const offerPrice = async (token_id: string, price: string | undefined) => {
    if (walletConnection) {
      await walletConnection.account().functionCall({
        contractId: config.marketContract,
        methodName: "offer",
        args: {
          nft_contract_id: config.nftContract,
          token_id,
        },
        attachedDeposit: price,
        gas: "200000000000000",
      });
    }
    router.push("/mynfts");
  };

  return (
    <div className="flex flex-col justify-center bg-nh-gray h-fit rounded-xl w-60">
      <div className="h-3/4 rounded-t-xl p-2">
        <img
          src={metadata.media}
          alt="nft"
          className="rounded-t-xl object-cover h-80 w-60"
        />
      </div>
      <div className="flex justify-between mx-2 mt-2">
        <div className="flex justify-center overflow-scroll w-fit mr-1 rounded-xl bg-nh-purple p-2">
          <h2>{metadata.title}</h2>
        </div>
        {!sellOrBid && (
          <div className="flex justify-end gap-1 w-28 items-center rounded-xl">
            <div className="flex justify-center gap-1 items-center rounded-xl p-3 bg-nh-purple-highlight">
              <NearLogo />
            </div>
            <div className="flex overflow-scroll min-w-0: justify-center gap-1 items-center rounded-xl p-2 bg-nh-purple">
              <h3 className="break-words px-[6px]">{sale_conditions}</h3>
            </div>
          </div>
        )}
      </div>
      <div className="flex overflow-scroll mt-2 p-2 mx-2 bg-nh-purple-highlight rounded-xl">
        <h1 className="break-words">{metadata.description}</h1>
      </div>
      <div className="flex flex-col justify-center p-2">
        {sellOrBid ? (
          <button
            className="bg-nh-purple hover:bg-nh-purple-highlight w-full p-2 text-black rounded-xl"
            onClick={async () => {
              setSellNft(true);
            }}
          >
            {translations.nft.sell}
          </button>
        ) : (
          <button
            className={`bg-nh-purple hover:bg-nh-purple-highlight w-full p-2 text-black rounded-xl
                        ${checkSellerIsOwner() ? "cursor-not-allowed" : ""}`}
            onClick={async () => {
              if (!checkSellerIsOwner()) {
                offerPrice(token_id, sale_conditions);
              } else {
                setYourOwnNft(true);
              }
            }}
          >
            {translations.nft.buy}
          </button>
        )}
      </div>
      {sellNft && (
        <SellNftDialog
          onClose={handleClose}
          walletConnection={walletConnection}
          token_id={token_id}
        />
      )}
      {yourOwnNft && <CantBuyYourOwnNftDialog onClose={handleClose} />}
    </div>
  );
}
