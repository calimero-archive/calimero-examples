#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2

#  ./scripts/deployNft.sh matej2.hackathon.calimero.testnet hackathon-calimero-testnet
near deploy --accountId $ACCOUNT_ID --wasmFile res/non_fungible_token.wasm --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID --initDeposit 10
