#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2

#  ./scripts/deployRegistrar.sh matej-nft.hackathon.calimero.testnet hackathon-calimero-testnet
#example   near deploy --accountId matej-nft.hackathon.calimero.testnet --wasmFile res/non_fungible_token.wasm --nodeUrl https://api.development.calimero.network/api/v1/shards/hackathon-calimero-testnet/neard-rpc --networkId hackathon-calimero-testnet --initDeposit 10
near deploy --accountId $ACCOUNT_ID --wasmFile res/registrar_contract.wasm --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID --initDeposit 10
