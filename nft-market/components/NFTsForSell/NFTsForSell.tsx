import NFT from "@/components/NFT/NFT";
import { NFTProps } from "@/components/NFT/NFT";
import { useState, useEffect } from "react";
import { WalletConnection } from "near-api-js";
import { getConfig } from "../../utils/config";

const CONTRACT = "market_contract_test.kuzmatest2.testnet";

const nearConfig = getConfig();



interface NFTsForSellProps {
    walletConnection: WalletConnection | undefined;
}

export default function NFTsForSell({ walletConnection}: NFTsForSellProps) {
    const [nftsForSell, setNftsForSell] = useState<NFTProps[]>([]);

    useEffect(() => {
        const find = async () => {
            await loadSaleItems();
        }
        find();
      }, []);

      const loadSaleItems = async () => {
        if(walletConnection) {
            const wallet = walletConnection;
            let nftTokens = await walletConnection
            .account()
            .viewFunction(nearConfig.contractName, "nft_tokens", {
                from_index: "0",
                limit: 64,
            });
            let saleTokens = await walletConnection
            .account()
            .viewFunction(
                CONTRACT,
                "get_sales_by_nft_contract_id",
                {
                nft_contract_id: nearConfig.contractName,
                from_index: "0",
                limit: 64,
                }
            );
            let sales = [];
            for (let i = 0; i < nftTokens.length; i++) {
            const { token_id } = nftTokens[i];
            let saleToken = saleTokens.find(({ token_id: t }: {token_id: string}) => t === token_id);
            if (saleToken !== undefined) {
                sales[i] = Object.assign(nftTokens[i], saleToken);
            
            }
            }
            setNftsForSell(sales)
            console.log("sales1");
            console.log(sales);
            console.log("sales2");
            
            
        
        }
    }

    return (
        <div className="w-full h-scree grid grid-cols-3 gap-8">
            {nftsForSell.map((nft) => {
                return (
                    <NFT key={nft.token_id} metadata={nft.metadata} owner_id={nft.owner_id} 
                        token_id={nft.token_id} walletConnection={walletConnection} sellOrBid={false}
                        sale_conditions={nft.sale_conditions}
                    />
                )
            }

            )}
        </div>
    )
}