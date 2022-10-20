#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi
destination_master_account="$1.calimero.testnet"

near create-account \
  "tictactoe.$destination_master_account" \
  --masterAccount $destination_master_account \
  --nodeUrl "https://api.development.calimero.network/api/v1/shards/$1-calimero-testnet/neard-rpc/" \
  --networkId "$1-calimero-testnet" && \
near deploy \
  --accountId "tictactoe.$destination_master_account" \
  --initFunction new --initArgs {} \
  --wasmFile target/wasm32-unknown-unknown/release/tic_tac_toe.wasm \
  --nodeUrl "https://api.development.calimero.network/api/v1/shards/$1-calimero-testnet/neard-rpc/" \
  --networkId "$1-calimero-testnet"
