#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2
MASTER_ACCOUNT=$3

#  ./scripts/createAccount.sh matej2.hackathon.calimero.testnet hackathon-calimero-testnet hackathon.calimero.testnet
near create-account $ACCOUNT_ID --masterAccount $MASTER_ACCOUNT --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID
