## Set up NEAR CLI

Follow [Calimero Network DApp part 2 blog](https://www.calimero.network/blog/deploy-calimero-dapp-run-shard) for setting up the NEAR CLI.
You have to do that for both contracts.

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

## Deploy

Inside the folder of the contract for both contracts open the deploy.sh files and replace MAIN_ACCOUNT_ID, CONTRACT_SUBACCOUNT_ID and SHARD_ID with your info.

Example:

```bash
near deploy marketcontract.demos.calimero.testnet --wasmFile market_contract.wasm --networkId demos-calimero-testnet --nodeUrl https://api.calimero.network/api/v1/shards/demos-calimero-testnet/neard-rpc/
```

Then deploy the contracts.

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
near call marketcontract.demos.calimero.testnet new_default_meta '{"owner_id": "nftcontract.demos.calimero.testnet"}' --accountId demos.calimero.testnet --networkId demos-calimero-testnet --nodeUrl https://api.calimero.network/api/v1/shards/demos-calimero-testnet/neard-rpc/
```

Then init the contracts:

```bash
./init
```

## Run the app

Go to the ui's README.md file and follow the instructions for runnig the app.
