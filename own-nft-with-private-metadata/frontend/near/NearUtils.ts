import * as nearAPI from 'near-api-js';
import {connect, KeyPair, keyStores, Contract, Account} from "near-api-js";
import {KeyStore} from "near-api-js/lib/key_stores";

const contractAdddressId = "";
const BASE_URL: string = process.env.BASE_URL ? process.env.BASE_URL : "INVALID ENV";
const selectedShard: string = process.env.SHARD_ID ? process.env.SHARD_ID : "INVALID ENV";
const masterAccountPrivateKey: string = process.env.MASTER_ACCOUNT_PRIVATE_KEY ? process.env.MASTER_ACCOUNT_PRIVATE_KEY : "INVALID ENV";
const authToken: string = process.env.AUTH_TOKEN ? process.env.AUTH_TOKEN : "INVALID ENV";

interface connectedData {
    account: Account;
    keyStore: KeyStore;
}

export async function connectToShard(
    accountId: string
): Promise<connectedData> {
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(masterAccountPrivateKey);
    await keyStore.setKey(selectedShard, accountId, keyPair);
    const near = await connect(getConfig(keyStore, selectedShard));
    const account = await near.account(accountId);
    return {account, keyStore};
}

export const getConfig = (keyStore: KeyStore, shardId: string) => {
    return {
        networkId: shardId,
        nodeUrl: `${ BASE_URL }/api/v1/shards/${ shardId }/neard-rpc/`,
        shardId,
        deps: {
            keyStore,
        },
        headers: {
            authorization: authToken
        },
    };
};
