#!/bin/bash

ACCOUNT_ID=$1
SHARD_ID=$2
OWNER_ID=$3

#  ./scripts/changeOwner.sh matej.hackathon.calimero.testnet hackathon-calimero-testnet matej-nft.hackathon.calimero.testnet
near call $ACCOUNT_ID change_owner '{"token_id":"matej5", "owner_metadata":{"owner_id":"'$OWNER_ID'", "owner_full_name": "matej vuki", "address": "moja adresa", "item_type": "Kuca", "item_size":"100"},"token_metadata":{"title": "Bazen uz plazu", "description": "Plavo more", "copies": 1} }' --accountId $OWNER_ID --nodeUrl https://api.development.calimero.network/api/v1/shards/$SHARD_ID/neard-rpc --networkId $SHARD_ID --depositYocto 1
