import Image from "next/image";
import translations from "../../constants/en.global.json";
import * as nearAPI from "near-api-js";
import { getConfig } from "../../utils/config";
import { useState } from "react";

const CONTRACT = "market_contract_test.kuzmatest2.testnet";

const nearConfig = getConfig();

interface Metadata {
    description: string,
    media: string,
    title: string,
}


export interface NFTProps {
    approved_accounts_ids?: object,
    metadata: Metadata,
    owner_id: string,
    token_id: string,
    sale_conditions?: string,
    walletConnection: nearAPI.WalletConnection | undefined;
    sellOrBid: boolean;
}
  

export default function NFT({ approved_accounts_ids, metadata, owner_id, token_id, sale_conditions, walletConnection, sellOrBid }: NFTProps) {
    const [sell, setSell] = useState(false);
    const [price, setPrice] = useState("");
    const [bid, setBid] = useState(false);
    console.log("sale_conditions");
    
    console.log(sale_conditions)

    const checkSellerIsOwner = () => {
        if(owner_id === walletConnection?._authData.accountId) {
            return "cursor-not-allowed";
        }
        return "";
    }

    
    
      const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPrice(value)
        console.log(price);
        
      };

    
    

    const approveNFTForSale = async (token_id: string) => {
        let sale_conditions = {
          sale_conditions: price,
        };
        
        if(walletConnection) {
            await walletConnection.account().functionCall({
                contractId: nearConfig.contractName,
                methodName: "nft_approve",
                args: {
                    token_id: token_id,
                    account_id: CONTRACT,
                    msg: JSON.stringify(sale_conditions),
                },
                gas: "300000000000000",
                attachedDeposit: "10000000000000000000001",
            });
        }
        
    }

    const offerPrice = async (token_id: string) => {
        if(walletConnection) {
            await walletConnection.account().functionCall({
                contractId: CONTRACT,
                methodName: "offer",
                args: {
                    nft_contract_id: nearConfig.contractName,
                    token_id,
                },
                attachedDeposit: price,
                gas: "200000000000000",
            })
        }
      }

    return (
        <div className="flex flex-col justify-center bg-nh-purple-disabled rounded w-fit p-1">
            <div>
                <Image 
                    src={metadata.media} 
                    alt="nft" 
                    height={400} 
                    width={320}
                    className="rounded"
                />
            </div>
            <div className="flex justify-center">
                <h1>{metadata.title}</h1>
            </div>
            <div className="flex justify-between">
                <h3>{metadata.description}</h3>
                {!sellOrBid &&
                    <h4>{sale_conditions} N</h4>
                }
            </div>
            <div className="flex flex-col justify-center mt-4">
                {sellOrBid ? 
                    <>
                        {!sell && <button className="bg-white hover:bg-nh-text w-full p-2 text-black rounded"
                            onClick={async () => {
                               setSell(true)
                            }}
                        >
                            {translations.nft.sell}
                        </button>}
                        {sell &&
                            <div className="flex flex-col gap-2">
                                <input type="number" placeholder="Enter amount" 
                                    className="p-2 text-center rounded focus:outline-none"
                                    value={price} onChange={handlePrice}
                                >
                                </input>
                                <div className="flex justify-center gap-2">
                                    <button className="bg-white hover:bg-nh-text p-2 w-full text-black rounded"
                                        onClick={async () => {
                                            approveNFTForSale(token_id)
                                        }}
                                    >
                                        {translations.nft.sell}
                                    </button>
                                    <button className="bg-white hover:bg-nh-text p-2 w-full text-black rounded"
                                        onClick={async () => {
                                            setSell(false)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        
                        }
                    </>
                    
                :
                <>
                    {!bid && <button className={`bg-white hover:bg-nh-text w-full p-2 text-black rounded
                        ${checkSellerIsOwner()}`}
                        title="Can't buy your own NFTs"
                        onClick={async () => {
                           setBid(true)
                        }}
                    >
                        {translations.nft.bid}
                    </button>}
                    {bid &&
                        <div className="flex flex-col gap-2">
                            <input type="number" placeholder="Enter amount" 
                                className="appearance-none p-2 text-center rounded focus:outline-none"
                                value={price} onChange={handlePrice}
                            >
                            </input>
                            <div className="flex justify-center gap-2">
                                <button className="bg-white hover:bg-nh-text p-2 w-full text-black rounded"
                                    onClick={async () => {
                                        offerPrice(token_id)
                                    }}
                                >
                                    {translations.nft.bid}
                                </button>
                                <button className="bg-white hover:bg-nh-text p-2 w-full text-black rounded"
                                    onClick={async () => {
                                        setBid(false)
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    
                    }
                </>
                    
                }
            </div>
        </div>
    )
}