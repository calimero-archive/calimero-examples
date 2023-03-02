#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi
destination_master_account="$1.calimero.testnet"
near create-account \
  "voting.$destination_master_account" \
  --masterAccount $destination_master_account \
  --nodeUrl "calimero-rpc-node-url" \
  --networkId "$1-calimero-testnet" && \
near deploy \
  --accountId "voting.$destination_master_account" \
  --initFunction new --initArgs '{"question": "Which blockchain is best?", "options": ["NEAR","Bitcoin"]}' \
  --wasmFile target/wasm32-unknown-unknown/release/poll.wasm \
  --nodeUrl "calimero-rpc-node-url" \
  --networkId "$1-calimero-testnet"