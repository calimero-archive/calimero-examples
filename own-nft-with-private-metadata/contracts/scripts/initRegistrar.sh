#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2

#  ./scripts/initNft.sh matej-nft.hackathon.calimero.testnet hackathon-calimero-testnet
near call $ACCOUNT_ID new '{"nft_account_id":"'+$ACCOUNT_ID+'"}' --accountId $ACCOUNT_ID --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID
