#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2

#  ./scripts/deployRegistrar.sh matej1.hackathon.calimero.testnet hackathon-calimero-testnet
near deploy --accountId $ACCOUNT_ID --wasmFile res/registrar_contract.wasm --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID --initDeposit 10
