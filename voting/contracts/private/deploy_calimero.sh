#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi
destination_master_account="$1.calimero.testnet"
near deploy \
  --accountId "$destination_master_account" \
  --initFunction new --initArgs '{"question": "Which blockchain is best?", "options": ["NEAR","Bitcoin"]}' \
  --wasmFile target/wasm32-unknown-unknown/release/poll.wasm \
  --nodeUrl "https://api.dev.calimero.network/api/v1/shards/my-awesome-shard-calimero-testnet/neard-rpc/" \
  --networkId "my-awesome-shard-calimero-testnet"
