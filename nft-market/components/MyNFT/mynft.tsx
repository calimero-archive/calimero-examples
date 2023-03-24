import NFT from "@/components/NFT/NFT";
import { NFTProps } from "@/components/NFT/NFT";
import { displayAllNFT } from "@/utils/mint";
import { useState, useEffect } from "react";
import { WalletConnection } from "near-api-js";

interface MyNFTProps {
    walletConnection: WalletConnection | undefined;
}

export default function MyNFT({ walletConnection}: MyNFTProps) {
    const [nfts, setNfts] = useState<NFTProps[]>([]);

    useEffect(() => {
        const find = async () => {
            const nfts = await displayAllNFT(walletConnection)
            setNfts(nfts)
            console.log(nfts);
        }
        find()
      }, []);

    return (
        <div className="w-full h-scree grid grid-cols-4">
            {nfts.map((nft) => {
                return (
                    <NFT key={nft.token_id} metadata={nft.metadata} owner_id={nft.owner_id} token_id={nft.token_id} />
                )
            }

            )}
        </div>
    )
}