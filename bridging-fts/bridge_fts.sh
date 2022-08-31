#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters (shard_id)"
    exit 1
fi
destination_master_account="$1.calimero.testnet"

SOURCE_RPC_ENDPOINT="https://rpc.testnet.near.org" \
SOURCE_NETWORK_ID=testnet \
SOURCE_FT_CONNECTOR_CONTRACT_ACCOUNT_ID=connector.lucija.igi.testnet \
SOURCE_AUTH_API_KEY="" \
DESTINATION_RPC_ENDPOINT="https://api-staging.calimero.network/api/v1/shards/$1-calimero-testnet/neard-rpc" \
DESTINATION_NETWORK_ID="$1-calimero-testnet" \
DESTINATION_FT_CONNECTOR_CONTRACT_ACCOUNT_ID="connector.$destination_master_account" \
DESTINATION_AUTH_API_KEY="2b909a08d7f1eba6ac6b5f9f47ee4466a6bf80e28a3385f42a82e805cb96c064" \
npm run dev
