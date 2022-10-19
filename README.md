# Calimero Examples 
## _Overview of the examples_
All examples have detailed instructions:
- for compiling Rust smart contracts
- for creating contract accounts on Calimero
- deploying contracts on Calimero
- starting UI frontend for contracts
- code explanation for building your own UI
- code explanation for connecting Wallet, connecting to Calimero Private Shard RPC and for interaction with smart contracts deployed on Calimero

## _Examples_
- Tic-tac-toe game - simple contract and UI for two player game 
- Voting - example of poll voting on Blockchain
- Calimero Login - UI component for connecting to Calimero Shard with wallet 
- Bridging FT's - contracts for briding Fungible tokens via  NEAR Testnet <-> Calimero
- Near Sign Message - simple vanilla HTML + javascript for using wallet to sign transactions

## _Instructions_
For examples to work you need to clone repository [calimero-examples](https://github.com/calimero-is-near/calimero-examples), [near-wallet](https://github.com/calimero-is-near/near-wallet) and have access to [Calimero platform](https://alpha.app.calimero.network/)

## _1. Wallet setup_
After you cloned [near-wallet](https://github.com/calimero-is-near/near-wallet) repository  
-  position yourself in the frontend folder 
```sh
~ % cd (.../home/..) near-wallet/packages/frontend 
```
- run the wallet frontend on https://localhost:1234/
```sh
~ % yarn && NEAR_WALLET_ENV=testnet yarn start
```
More instructions in wallet README.md files

## _2. Calimero Shard Dashboard_
On [Calimero Application Dashboard](https://alpha.app.calimero.network/) get RPC endpoint located in `neard-rpc` field, copy the endpoint for later.
Navigate to Security page on the Calimero Application and issue a new token and also save it for later.

## _3.Calimero Examples Setup_
Setup for `tictactoe` example:
- get instructions on Contract deployment from README.md inside the `contracts` folder
- to run the frontend navigate to UI folder and read instructions from README.md
