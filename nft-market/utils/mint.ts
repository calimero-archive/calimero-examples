import { getConfig } from "./config";
import { WalletConnection, connect } from "near-api-js";

const nearConfig = getConfig();

export async function mintAssetToNft(wallet: WalletConnection | undefined,title: string, description: string, media: string) {
    let functionCallResult = await wallet?.account().functionCall({
      contractId: nearConfig.contractName,
      methodName: "nft_mint",
      args: {
        token_id: title,
        metadata: {
          title: title,
          description: description,
          media: media,
        },
        receiver_id: localStorage.getItem("nearAccountId"),
      },
      attachedDeposit: "6610000000000000000000",
    });

    if (functionCallResult) {
      console.log("nft meta sent: ");
    } else {
      console.log("nft meta not sent");
    }
    console.log(displayAllNFT(wallet));
};


export async function displayAllNFT(walletConnection: WalletConnection | undefined) {
    let result = await walletConnection?.account()
      .viewFunction(nearConfig.contractName, "nft_tokens_for_owner", {
        account_id: localStorage.getItem("nearAccountId"),
        from_index: "0",
        limit: 64,
      });
    return result;
  };