import { WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";

export async function mintAssetToNft(
  wallet: WalletConnection | undefined,
  title: string,
  description: string,
  media: string
) {
  let functionCallResult = await wallet?.account().functionCall({
    contractId: config.nftContract,
    methodName: "nft_mint",
    args: {
      token_id: title,
      metadata: {
        title: title,
        description: description,
        media: media,
      },
      receiver_id: localStorage.getItem("accountId"),
    },
    attachedDeposit: "6970000000000000000000",
  });
  if (functionCallResult) {
    console.log("nft meta sent: ");
  } else {
    console.log("nft meta not sent");
  }
  console.log(displayAllNFT(wallet));
}

export async function displayAllNFT(
  walletConnection: WalletConnection | undefined
) {
  let result = await walletConnection
    ?.account()
    .viewFunction(config.nftContract, "nft_tokens_for_owner", {
      account_id: localStorage.getItem("accountId"),
      from_index: "0",
      limit: 64,
    });
  return result;
}
