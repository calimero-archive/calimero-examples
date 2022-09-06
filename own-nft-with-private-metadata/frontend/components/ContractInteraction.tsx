import * as nearAPI from 'near-api-js';
import {connect, KeyPair, keyStores, Contract, Account} from "near-api-js";
import {KeyStore} from "near-api-js/lib/key_stores";
import {connectToShard} from '../near/NearUtils';

const contractAdddressId: string = process.env.REGISTRAR_CONTRACT_ACCOUNT_ID ? process.env.REGISTRAR_CONTRACT_ACCOUNT_ID : "INVALID ENV";
const BASE_URL: string = process.env.BASE_URL ? process.env.BASE_URL : "INVALID ENV";
const selectedShard: string = process.env.SHARD_ID ? process.env.SHARD_ID : "INVALID ENV";
const masterAccountPrivateKey: string = process.env.MASTER_ACCOUNT_PRIVATE_KEY ? process.env.MASTER_ACCOUNT_PRIVATE_KEY : "INVALID ENV";
const registrarAccountId = process.env.REGISTRAR_ACCOUNT_ID ? process.env.REGISTRAR_ACCOUNT_ID : "INVALID ENV";

export async function createRecord() {

    const near = await connectToShard(registrarAccountId);
    const walletAcc = near.account;

    console.log("dd", contractAdddressId);

    const contract = new nearAPI.Contract(
        walletAcc,
        contractAdddressId,
        {
            changeMethods: ["create_record", "change_owner"],
            viewMethods: [],
        });

    console.log("contract");

    await contract["create_record"](
        {
            "token_id": "matej7",
            "metadata": {
                "owner_metadata": {
                    "owner_id": "'$OWNER_ID'",
                    "owner_full_name": "matej vuki",
                    "address": "adresa usera",
                    "item_type": "Stan",
                    "item_size": "100"
                },
                "property_metadata": {
                    "address": "adresa propertya",
                    "item_type": "Kuca",
                    "item_size": "100"
                }
            }, "token_metadata": {"title": "Bazen uz plazu", "description": "Plavo more", "copies": 1}
        },
        "",
        nearAPI.utils.format.parseNearAmount("0.1")
    );
    console.log("vratio");

}

export function initContract() {
    console.log("init");
}

function mintContract() {
    console.log("mint");
}

function ViewContract() {
    console.log("view");
}

function installContract() {
    console.log("install");
}