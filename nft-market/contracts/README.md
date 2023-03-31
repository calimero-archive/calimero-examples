## Build the contracts

Navigate to the contracts folder

```bash
cd contracts
```

For both contract navigate to their folder and build the contracts

```bash
cd nft_contract
./build
```

```bash
cd market_contract
./build
```

## Create accounts for contracts

For both contracts run:

```bash
 near create-account <CONTRACT_ACCOUNT_ID>.<MAIN_ACCOUNT_ID> --masterAccount <MAIN_ACCOUNT_ID> --networkId <SHARD_ID> --nodeUrl https://api.calimero.network/api/v1/shards/<SHARD_ID>/neard-rpc/
./build
```

You can arbitrarily name <CONTRACT_ACCOUNT_ID>.

## Deploy

Inside the folder of the contract for both contracts open the deploy.sh files and replace MAIN_ACCOUNT_ID, CONTRACT_SUBACCOUNT_ID and SHARD_ID with your info.

Example of the deploy.sh file for market contract:

```bash
near deploy marketcontract.demos.calimero.testnet --wasmFile market_contract.wasm --networkId demos-calimero-testnet --nodeUrl https://api.calimero.network/api/v1/shards/demos-calimero-testnet/neard-rpc/
```

Then deploy the contracts. For both contracts, from their folder, run:

```bash
./deploy
```

## Init

Inside the folder of the contract for both contracts open the init.sh files and replace MAIN_ACCOUNT_ID, CONTRACT_SUBACCOUNT_ID and SHARD_ID with your info.

Examples:

```bash
near call nftcontract.demos.calimero.testnet new_default_meta '{"owner_id": "nftcontract.demos.calimero.testnet"}' --accountId demos.calimero.testnet --networkId demos-calimero-testnet --nodeUrl https://api.calimero.network/api/v1/shards/demos-calimero-testnet/neard-rpc/
```

```bash
near call marketcontract.demos.calimero.testnet new '{"owner_id": "nftcontract.demos.calimero.testnet"}' --accountId demos.calimero.testnet --networkId demos-calimero-testnet --nodeUrl https://api.calimero.network/api/v1/shards/demos-calimero-testnet/neard-rpc/
```

Then init the contracts. For both contracts, from their folder, run:

```bash
./init
```

## Run the app

Go to the ui's README.md file and follow the instructions for runnig the app.
