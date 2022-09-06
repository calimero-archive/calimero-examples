import * as nearAPI from 'near-api-js';
import {connectToShard} from '../near/NearUtils';

const registrarAccountId = process.env.REGISTRAR_ACCOUNT_ID ? process.env.REGISTRAR_ACCOUNT_ID : "INVALID ENV";

export interface RegistrarCreateRecord {
    token_id: string,
    metadata: {
      owner_metadata: {
        owner_id: string,
        owner_full_name: string,
        address: string,
        item_type: string,
        item_size: string;
      },
      property_metadata: {
        address: string,
        item_type: string,
        item_size: string;
      };
    },
    token_metadata: {
      title: string,
      description: string,
      copies: number;
    };
  }

export interface RegistrarChangeOwner {
    token_id: string,
    metadata: {
      owner_metadata: {
        owner_id: string,
        owner_full_name: string,
        address: string,
        item_type: string,
        item_size: string;
      },
      property_metadata: {
        address: string,
        item_type: string,
        item_size: string;
      };
    },
    token_metadata: {
      title: string,
      description: string,
      copies: number;
    };
}

export async function registrarCreateRecord(record: RegistrarCreateRecord) {
    const {account} = await connectToShard();
    const walletAcc = account;
    const contract = new nearAPI.Contract(
        walletAcc,
        registrarAccountId,
        {
            changeMethods: ["new", "create_record", "change_owner"],
            viewMethods: [],
        });

    await contract["create_record"](
        {
            token_id: record.token_id,
            metadata: {
                owner_metadata: record.metadata.owner_metadata,
                property_metadata: record.metadata.property_metadata
            },
            token_metadata: record.token_metadata
        },
        BigInt("300000000000000").toString(),
        nearAPI.utils.format.parseNearAmount("0.1")
    );
}

export async function registratInitContract() {
    const {account} = await connectToShard();
    const walletAcc = account;
    const contract = new nearAPI.Contract(
        walletAcc,
        registrarAccountId,
        {
            changeMethods: ["new", "create_record", "change_owner"],
            viewMethods: [],
        });

    await contract["new"](
        {
        },
        BigInt("300000000000000").toString()
    );
}

export async function registrarChangeOwner(record:RegistrarChangeOwner) {
    const {account} = await connectToShard();
    const walletAcc = account;
    const contract = new nearAPI.Contract(
        walletAcc,
        registrarAccountId,
        {
            changeMethods: ["new", "create_record", "change_owner"],
            viewMethods: [],
        });

    await contract["change_owner"](
        {
            token_id: record.token_id,
            metadata: {
                owner_metadata: record.metadata.owner_metadata,
                property_metadata: record.metadata.property_metadata
            },
            token_metadata: record.token_metadata
        },
    );
}

function ViewContract() {
    console.log("view");
}

function installContract() {
    console.log("install");
}