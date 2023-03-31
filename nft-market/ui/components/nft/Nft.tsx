import { WalletConnection } from "calimero-sdk";
import { useState } from "react";
import { useRouter } from "next/router";
import SellNftDialog from "../sellNftDialog/SellNftDialog";
import CantBuyYourOwnNftDialog from "../cantBuyYourOwnNftDialog/CantBuyYourOwnNftDialog";
import NftCard from "../nftCard/NftCard";
import { buyNft } from "@/utils/callMethods";

export interface Metadata {
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

  return (
    <>
      <NftCard
        metadata={metadata}
        sale_conditions={sale_conditions}
        sellOrBid={sellOrBid}
        sell={async () => {
          setSellNft(true);
        }}
        buy={async () => {
          if (!checkSellerIsOwner()) {
            buyNft(
              walletConnection,
              token_id,
              sale_conditions ? sale_conditions : ""
            );
          } else {
            setYourOwnNft(true);
          }
        }}
        checkSellerIsOwner={checkSellerIsOwner}
      />
      {sellNft && (
        <SellNftDialog
          onClose={handleClose}
          walletConnection={walletConnection}
          token_id={token_id}
        />
      )}
      {yourOwnNft && <CantBuyYourOwnNftDialog onClose={handleClose} />}
    </>
  );
}
