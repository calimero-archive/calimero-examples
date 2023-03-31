import translations from "../../constants/en.global.json";
import NearLogo from "../images/NearLogo";
import { Metadata } from "../nft/Nft";

interface NFTCardProps {
  metadata: Metadata;
  sale_conditions?: string;
  sellOrBid: boolean;
  sell: () => void;
  buy: () => void;
  checkSellerIsOwner: () => boolean | undefined;
}

export default function NftCard({
  metadata,
  sale_conditions,
  sellOrBid,
  sell,
  buy,
  checkSellerIsOwner,
}: NFTCardProps) {
  return (
    <div className="flex flex-col justify-center bg-nh-gray h-[480px] rounded-xl w-60">
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
      <div className="flex overflow-scroll items-center mt-2 p-2 mx-2 bg-nh-purple-highlight rounded-xl">
        <h1 className="break-words">{metadata.description}</h1>
      </div>
      <div className="flex flex-col justify-center p-2">
        {sellOrBid ? (
          <button
            className="bg-nh-purple hover:bg-nh-purple-highlight w-full p-2 text-black rounded-xl"
            onClick={sell}
          >
            {translations.nft.sell}
          </button>
        ) : (
          <button
            className={`bg-nh-purple hover:bg-nh-purple-highlight w-full p-2 text-black rounded-xl
                        ${checkSellerIsOwner() ? "cursor-not-allowed" : ""}`}
            onClick={buy}
          >
            {translations.nft.buy}
          </button>
        )}
      </div>
    </div>
  );
}
