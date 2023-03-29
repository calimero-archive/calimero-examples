import NFT from "@/components/NFT/NFT";
import { NFTProps } from "@/components/NFT/NFT";
import { displayAllNFT } from "@/utils/mint";
import { useState, useEffect } from "react";
import { WalletConnection } from "calimero-sdk"
import * as nearAPI from "near-api-js";
import { config } from "../../utils/calimeroSdk"
import translations from "../../constants/en.global.json";

interface MyNFTProps {
    walletConnection: WalletConnection | undefined;
}

interface MyContract extends nearAPI.Contract {
    storage_deposit(options: any, gas: number, amount: string): Promise<any>;
}

export default function MyNFT({ walletConnection}: MyNFTProps) {
    const [nfts, setNfts] = useState<NFTProps[]>([]);

    const depositStorage = async () => {
        console.log(walletConnection);
        
        if(walletConnection) {
            const wallet = walletConnection;
            const contract = new nearAPI.Contract(
                wallet.account(),
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
                    nearAPI.utils.format.parseNearAmount("1") ?? "1" // account creation costs 0.00125 NEAR for storage
                );
            } catch (e){
            console.log(e);
            }
        }
    }

    useEffect(() => {
        const find = async () => {
            const nfts = await displayAllNFT(walletConnection)
            setNfts(nfts)
        }
        find()
      }, []);

    return (
        <>
            <div className="flex items-center justify-end gap-2 mb-4">
                <h1 className="text-white">
                    {translations.mynft.depositText}
                </h1>
                <button className="bg-white hover:bg-nh-purple  p-2 text-black rounded"
                    onClick={depositStorage}
                >
                    {translations.mynft.deposit}
                </button>
            </div>
            <div className="w-full h-scree grid grid-cols-3 gap-8 mb-20">
                {nfts.map((nft) => {
                    return (
                        <NFT key={nft.token_id} metadata={nft.metadata} owner_id={nft.owner_id} 
                            token_id={nft.token_id} walletConnection={walletConnection} sellOrBid={true}
                            sale_conditions={nft.sale_conditions}
                        />
                    )
                })}
            </div>
        </>
    )
}