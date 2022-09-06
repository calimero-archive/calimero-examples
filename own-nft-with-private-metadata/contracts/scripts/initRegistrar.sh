#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2

#  ./scripts/initRegistrar.sh matej1.hackathon.calimero.testnet hackathon-calimero-testnet
near call $ACCOUNT_ID new --accountId $ACCOUNT_ID --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID
