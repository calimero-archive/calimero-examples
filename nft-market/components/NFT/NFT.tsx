import Image from "next/image";
import translations from "../../constants/en.global.json";
import { WalletConnection } from "calimero-sdk";
import { useState } from "react";
import NearLogo from "../images/NearLogo";
import { config } from "../../utils/calimeroSdk";
import { useRouter } from "next/router";

interface Metadata {
  description: string;
  media: string;
  title: string;
}

export interface NFTProps {
  approved_accounts_ids?: object;
  metadata: Metadata;
  owner_id: string;
  token_id: string;
  sale_conditions?: string;
  walletConnection: WalletConnection | undefined;
  sellOrBid: boolean;
}

export default function NFT({
  approved_accounts_ids,
  metadata,
  owner_id,
  token_id,
  sale_conditions,
  walletConnection,
  sellOrBid,
}: NFTProps) {
  const router = useRouter();
  const [sell, setSell] = useState(false);
  const [price, setPrice] = useState("");
  const [bid, setBid] = useState(false);

  const checkSellerIsOwner = () => {
    if (!sellOrBid) {
      if (owner_id === walletConnection?._authData.accountId) {
        return true;
      }
      return false;
    }
  };

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPrice(value);
  };

  const approveNFTForSale = async (token_id: string) => {
    let sale_conditions = {
      sale_conditions: price,
    };
    if (walletConnection) {
      await walletConnection.account().functionCall({
        contractId: config.nftContract,
        methodName: "nft_approve",
        args: {
          token_id: token_id,
          account_id: config.marketContract,
          msg: JSON.stringify(sale_conditions),
        },
        gas: "300000000000000",
        attachedDeposit: "10000000000000000000001",
      });
    }
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
    <div className="flex flex-col justify-center bg-white h-fit rounded-xl w-fit">
      <div className="h-3/4 p-3 bg-nh-purple-disabled rounded-t-xl">
        <img
          src={metadata.media}
          alt="nft"
          className="rounded-t-xl object-cover h-80 w-60"
        />
      </div>
      <div className="flex justify-between mx-2 mt-2">
        <div className="flex justify-center rounded-xl bg-nh-purple p-2">
          <h2>{metadata.title}</h2>
        </div>
        {!sellOrBid && (
          <div className="flex gap-1 items-center rounded-xl p-2 bg-nh-purple-highlight">
            <NearLogo />
            <h3>{sale_conditions}</h3>
          </div>
        )}
      </div>
      <div className="flex mt-2 p-2 mx-2 bg-nh-purple-highlight rounded-xl">
        <h1>{metadata.description}</h1>
      </div>
      <div className="flex flex-col justify-center p-2">
        {sellOrBid ? (
          <>
            {!sell && (
              <button
                className="bg-nh-purple hover:bg-nh-purple-highlight w-full p-2 text-black rounded-xl"
                onClick={async () => {
                  setSell(true);
                }}
              >
                {translations.nft.sell}
              </button>
            )}
            {sell && (
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="p-2 text-center rounded-xl focus:outline-none border border-nh-purple-highlight text-nh-purple-highlight placeholder-nh-purple-highlight"
                  value={price}
                  onChange={handlePrice}
                ></input>
                <div className="flex justify-center gap-2">
                  <button
                    className="bg-nh-purple hover:bg-nh-purple-highlight p-2 w-full text-black rounded-xl"
                    onClick={async () => {
                      approveNFTForSale(token_id);
                    }}
                  >
                    {translations.nft.sell}
                  </button>
                  <button
                    className="bg-nh-purple hover:bg-nh-purple-highlight p-2 w-full text-black rounded-xl"
                    onClick={async () => {
                      setSell(false);
                    }}
                  >
                    {translations.nft.cancel}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {!bid && (
              <button
                className={`bg-nh-purple hover:bg-nh-purple-highlight w-full p-2 text-black rounded-xl
                        ${checkSellerIsOwner() ? "cursor-not-allowed" : ""}`}
                onClick={async () => {
                  if (!checkSellerIsOwner()) {
                    offerPrice(token_id, sale_conditions);
                  } else {
                    alert("Can't buy your own NFTs");
                  }
                }}
              >
                {translations.nft.buy}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
