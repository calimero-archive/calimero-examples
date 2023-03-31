import { WalletConnection } from "calimero-sdk";
import NFT, { NFTProps } from "../nft/Nft";

interface NftsContainerProps {
  walletConnectionObject: WalletConnection | undefined;
  sellOrBuy: boolean;
  nfts: NFTProps[];
}

export default function NftsContainer({
  walletConnectionObject,
  sellOrBuy,
  nfts,
}: NftsContainerProps) {
  return (
    <div className="w-full h-scree grid grid-cols-3 gap-8 mb-20">
      {nfts.map((nft) => {
        return (
          <NFT
            key={nft.token_id}
            metadata={nft.metadata}
            owner_id={nft.owner_id}
            token_id={nft.token_id}
            walletConnection={walletConnectionObject}
            sellOrBid={sellOrBuy}
            sale_conditions={nft.sale_conditions}
          />
        );
      })}
    </div>
  );
}
