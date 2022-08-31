## Requirements

[https://docs.calimero.network/bridge/bridging/prerequisites](https://docs.calimero.network/bridge/bridging/prerequisites)

Node 
```
node --version
v16.14.2
```

## Running the example

```
./bridge_fts.sh {shard-id}
```

Example usage, locking on NEAR and withdrawing from Calimero:
```
./bridge_fts.sh lucija

Choose action:
  1) Transfer tokens from source network
  2) Transfer tokens to source network
  *) Any other input exits
1
Enter NEAR Testnet account to transfer from:
> igi.testnet
Enter FT token account id of FT you want to transfer (e.g. wrap.testnet): 
usdn.testnet
Enter amount of FT for transferring to the usdn.testnet contract while calling the method ft_transfer_call:
77
Transferring to ft_connector_source contract: connector.lucija.igi.testnet
Retrying request to broadcast_tx_commit as it has timed out [
  'CwAAAGlnaS50ZXN0bmV0AFidsEm0+A1RHw2YDrIPrzQSLECvXglm1tMZKT4PdqIJDjkhd/lSAAAMAAAAdXNkbi50ZXN0bmV0/L3NJceH9x4EAVW7m/UDt7WVU2pIGW7w/BxH14Sql6IBAAAAAhAAAABmdF90cmFuc2Zlcl9jYWxsWAAAAHsicmVjZWl2ZXJfaWQiOiJjb25uZWN0b3IubHVjaWphLmlnaS50ZXN0bmV0IiwiYW1vdW50IjoiNzciLCJtZW1vIjpudWxsLCJtc2ciOiJ0ZXN0bmV0In0AwG4x2RABAAEAAAAAAAAAAAAAAAAAAAAAVI3pVu8WqkJgHQE36TVTiji24XEY5/nI0GrDknrp0zd4Cp3NO2GNqX5SA26CTRFnlwIHTtkDx36tvJlQJgepCg=='
]
Receipts: NuDFdnXLaVuFZhArCrSFWmCywxBpexu99JWBnuTL4NY, 2Mutb7Ymgu6ehWWsJVq7HmesXtbYu54V9Sfv9MkJAquN, FLC6pxaeNP7Za2AQv9F3593qLjFY16pprKeyq3TF6YJu
        Log [usdn.testnet]: EVENT_JSON:{"standard":"nep141","version":"1.0.0","event":"ft_transfer","data":[{"old_owner_id":"igi.testnet","new_owner_id":"connector.lucija.igi.testnet","amount":"77"}]}
Receipt: BssaBzZrxcvg5mGE2zouYgbZhDXEW6mZhZ52iSmJxMeT
        Log [usdn.testnet]: CALIMERO_EVENT_LOCK:usdn.testnet:igi.testnet:77
Locked tokens to ft_connector_source contract on NEAR Testnet, tokens will be minted on Calimero side in a few seconds!
Lock tx hash: A1JjKEin9NxjV1e2nWhLWeApSmfB2hjKo4csbYRorVj2
===================

Choose action:
  1) Transfer tokens from source network
  2) Transfer tokens to source network
  *) Any other input exits
2
Enter Calimero account to transfer from:
> igi.lucija.calimero.testnet
Enter FT token account id (on NEAR Testnet) of FT you want to withdraw (e.g. wrap.testnet): 
usdn.testnet
Enter amount of FT for withdrawing: 
7
On destination chain this is the FT bridge contract for usdn.testnet: usdn.connector.lucija.calimero.testnet
Withdrawing from Calimero to NEAR Testnet...
Receipt: 
        Log [usdn.connector.lucija.calimero.testnet]: CALIMERO_EVENT_BURN:usdn.connector.lucija.calimero.testnet:igi.lucija.calimero.testnet:7
Withdrawn tokens to from Calimero, token will be unlocked on NEAR Testnet in a few seconds!
7qUuCt15zVH26U5tfNpcSXUfzEj7k5eRxaz3vhktdma7
===================

Choose action:
  1) Transfer tokens from source network
  2) Transfer tokens to source network
  *) Any other input exits
```