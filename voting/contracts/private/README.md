To compile Rust smart contract located in src/lib.rs use script ./build.sh .

```sh
$: ./build.sh
```

- Compiled .wasm file of the contract located in :
- target/wasm32-unknown-unknown/release/poll.wasm

## _Deploy_

To deploy contract on your Calimero Private Shard you need to:

- Create contract account with account that has permissions in Calimero
- Deploy and init contract

This proccess can be done from deploy_calimero.sh script.

```sh
$: ./deploy_calimero.sh k
```

k representing Calimero Private shard name without suffix (.calimero.testnet)

## _Contract Account Id_

Contract is now deployed on Calimero Private shard and can be found under name:

```sh
voting.<shardId>.calimero.testnet
```
