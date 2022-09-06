#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2
MASTER_ACCOUNT=$3

#  ./scripts/deleteAccount.sh matej2.hackathon.calimero.testnet hackathon-calimero-testnet hackathon.calimero.testnet
near delete $ACCOUNT_ID $MASTER_ACCOUNT --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID
