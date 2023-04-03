import { WalletConnection } from "calimero-sdk";
import { config } from "./calimeroSdk";
import * as nearAPI from "near-api-js";

export const mintAssetToNft = async (
  wallet: WalletConnection | undefined,
  title: string,
  description: string,
  media: string
) => {
  if (wallet) {
    const contract = new nearAPI.Contract(
      wallet.account(),
      config.nftContract,
      {
        changeMethods: ["nft_mint"],
        viewMethods: [],
      }
    );
    try {
      //@ts-ignore
      const res = await contract.nft_mint(
        {
          token_id: title,
          metadata: {
            title: title,
            description: description,
            media: media,
          },
          receiver_id: localStorage.getItem("accountId"),
        },
        "300000000000000", // attached gas
        "9370000000000000000000" //deposit
      );
    } catch (e) {
      console.log(e);
    }
  }
};

export const displayAllNFT = async (wallet: WalletConnection | undefined) => {
  if (wallet) {
    const contract = new nearAPI.Contract(
      wallet.account(),
      config.nftContract,
      {
        changeMethods: [],
        viewMethods: ["nft_tokens_for_owner"],
      }
    );
    try {
      //@ts-ignore
      const res = await contract.nft_tokens_for_owner({
        account_id: localStorage.getItem("accountId"),
        from_index: "0",
        limit: 64,
      });
      return res;
    } catch (e) {
      console.log(e);
    }
  }
};

export const buyNft = async (
  wallet: WalletConnection | undefined,
  token_id: string,
  price: string
) => {
  if (wallet) {
    const contract = new nearAPI.Contract(
      wallet.account(),
      config.marketContract,
      {
        changeMethods: ["offer"],
        viewMethods: [],
      }
    );
    try {
      //@ts-ignore
      const res = await contract.offer(
        {
          token_id,
          nft_contract_id: config.nftContract,
        },
        "300000000000000", // attached gas
        price //deposit
      );
    } catch (e) {
      console.log(e);
    }
  }
};

export const depositStorage = async (wallet: WalletConnection | undefined) => {
  if (wallet) {
    const contract = new nearAPI.Contract(
      wallet.account(),
      config.marketContract,
      {
        changeMethods: ["storage_deposit"],
        viewMethods: [],
      }
    );
    try {
      //@ts-ignore
      const res = await contract.storage_deposit(
        {},
        "30000000000000", // attached gas
        "10000000000000000000000" //deposit
      );
    } catch (e) {
      console.log(e);
    }
  }
};

export const setNftForSale = async (
  wallet: WalletConnection | undefined,
  token_id: string,
  price: string
) => {
  const regex = /^\d+(\.|,)?(\d+)?$/;
  if (regex.test(price)) {
    let sale_conditions = {
      sale_conditions: price,
    };
    if (wallet) {
      const contract = new nearAPI.Contract(
        wallet.account(),
        config.nftContract,
        {
          changeMethods: ["nft_approve"],
          viewMethods: [],
        }
      );
      try {
        //@ts-ignore
        const res = await contract.nft_approve(
          {
            token_id,
            account_id: config.marketContract,
            msg: JSON.stringify(sale_conditions),
          },
          "300000000000000", // attached gas
          "10000000000000000000001" //deposit
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
};
