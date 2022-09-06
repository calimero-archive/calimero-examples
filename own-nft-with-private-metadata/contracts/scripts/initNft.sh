#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2

#  ./scripts/initNft.sh matej2.hackathon.calimero.testnet hackathon-calimero-testnet
near call $ACCOUNT_ID new_default_meta '{"owner_id":"'$ACCOUNT_ID'","property_metadata":{ "address": "adresa properya", "item_type": "Kuca","item_size":"100"}}' --accountId $ACCOUNT_ID --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID