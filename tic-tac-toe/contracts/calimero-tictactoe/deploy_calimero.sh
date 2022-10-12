#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters"
    exit 1
fi
destination_master_account="$1.calimero.testnet"

near deploy \
  --accountId "tictactoe.$destination_master_account" \
  --initFunction new --initArgs {} \
  --wasmFile target/wasm32-unknown-unknown/release/tic_tac_toe.wasm \
  --nodeUrl "" \
  --networkId "$1-calimero-testnet"
