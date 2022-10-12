#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi
destination_master_account="$1.calimero.testnet"

near deploy \
  --accountId "voting.$destination_master_account" \
  --initFunction new --initArgs '{"question": "how can i deploy this?", "options": ["dunno","google it"]}' \
  --wasmFile target/wasm32-unknown-unknown/release/poll.wasm \
  --nodeUrl "" \
  --networkId "$1-calimero-testnet"
