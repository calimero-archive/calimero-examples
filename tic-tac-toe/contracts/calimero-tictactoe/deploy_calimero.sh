#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi

shard_id=$1
destination_master_account="$shard_id.calimero.testnet"

near create-account \
  "tictactoe.$destination_master_account" \
  --masterAccount $destination_master_account \
  --nodeUrl "https://api.dev.calimero.network/api/v1/shards/$shard_id-calimero-testnet/neard-rpc/" \
  --networkId "$1-calimero-testnet" && \
near deploy \
  --accountId "tictactoe.$destination_master_account" \
  --initFunction new --initArgs {} \
  --wasmFile target/wasm32-unknown-unknown/release/tic_tac_toe.wasm \
  --nodeUrl "https://api.dev.calimero.network/api/v1/shards/$shard_id-calimero-testnet/neard-rpc/" \
  --networkId "$1-calimero-testnet"
