import * as nearAPI from 'near-api-js';
import {connectToShard} from './NearUtils';

const nftContractAccountId = process.env.NFT_CONTRACT_ACCOUNT_ID ? process.env.NFT_CONTRACT_ACCOUNT_ID : "INVALID ENV";

export interface NftInitDefault {
    owner_id: string,
    property_metadata: {
        address: string,
        item_type: string,
        item_size: string;
    };
}

export interface NftMint {
    token_id: string,
    owner_id: string,
    token_metadata: {
        title: string,
        description: string,
        copies: number;
    };
}

export async function nftMint(record: NftMint) {
    const {account} = await connectToShard();
    const walletAcc = account;
    const contract = new nearAPI.Contract(
        walletAcc,
        nftContractAccountId,
        {
            changeMethods: ["new_default_meta", "nft_mint", "get_owner"],
            viewMethods: [],
        });

    await contract["nft_mint"](
        {
            token_id: record.token_id,
            owner_id: record.owner_id,
            token_metadata: record.token_metadata
        },
        BigInt("300000000000000").toString(),
        nearAPI.utils.format.parseNearAmount("0.1")
    );
}

export async function nftInitContract(record:NftInitDefault) {
    const {account} = await connectToShard();
    const walletAcc = account;
    const contract = new nearAPI.Contract(
        walletAcc,
        nftContractAccountId,
        {
            changeMethods: ["new_default_meta", "nft_mint", "get_owner"],
            viewMethods: [],
        });

    await contract["new_default_meta"](
        {
            owner_id: record.owner_id,
            property_metadata:record.property_metadata
        },
        BigInt("300000000000000").toString()
    );
}

export async function nftGetOwner(tokenId: string) {
    const {account} = await connectToShard();
    const walletAcc = account;
    const contract = new nearAPI.Contract(
        walletAcc,
        nftContractAccountId,
        {
            changeMethods: ["new_default_meta", "nft_mint", "get_owner"],
            viewMethods: [],
        });

    await contract["get_owner"](
        {
            token_id: tokenId
        },
    );
}

function ViewContract() {
    console.log("view");
}

function installContract() {
    console.log("install");
}