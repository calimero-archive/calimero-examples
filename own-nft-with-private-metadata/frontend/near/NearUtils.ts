import * as nearAPI from 'near-api-js';
import {connect, KeyPair, keyStores, Contract, Account, ConnectConfig} from "near-api-js";
import {KeyStore} from "near-api-js/lib/key_stores";
import {PublicKey} from 'near-api-js/lib/utils';
import * as bs58 from 'bs58';

const BASE_ENDPOINT: string = process.env.BASE_ENDPOINT ? process.env.BASE_ENDPOINT : "INVALID ENV";
const selectedShard: string = process.env.SHARD_ID ? process.env.SHARD_ID : "INVALID ENV";
const masterAccountPrivateKey: string = process.env.MASTER_ACCOUNT_PRIVATE_KEY ? process.env.MASTER_ACCOUNT_PRIVATE_KEY : "INVALID ENV";
const authToken: string = process.env.AUTH_TOKEN ? process.env.AUTH_TOKEN : "INVALID ENV";
const masterAccountId: string = process.env.MASTER_ACCOUNT_ID ? process.env.MASTER_ACCOUNT_ID : "INVALID ENV";

interface connectedData {
    account: Account;
    keyStore: KeyStore;
}

export async function connectToShard(
): Promise<connectedData> {
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(masterAccountPrivateKey);
    await keyStore.setKey(selectedShard, masterAccountId, keyPair);
    const near = await connect(getConfig(keyStore, selectedShard));
    const account = await near.account(masterAccountId);
    return {account, keyStore};
}

export const getConfig = (keyStore: KeyStore, shardId: string) => {
    return {
        networkId: shardId,
        nodeUrl: `${ BASE_ENDPOINT }api/v1/shards/${ shardId }/neard-rpc/`,
        shardId,
        keyStore,
        headers: {
            authorization: authToken
        },
    };
};
