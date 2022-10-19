
## Useful to have
Calimero alias:

```
alias calimero='function x() { near ${@:2} --nodeUrl https://api.development.calimero.network/api/v1/shards/$1/neard-rpc --networkId $1;} ; x'
```

## Deploy contract on NEAR side
```
cd near-tictactoe
./build.sh
```

### Deploy to specific account on NEAR testnet
Deploys contract to **tictactoe.igi.testnet**:
```
near deploy --wasmFile target/wasm32-unknown-unknown/release/tic_tac_toe.wasm --initFunction new --initArgs '{}' --accountId tictactoe.igi.testnet
```

### Dev-deploy
Optionally, deploy to a dev account
```
cd near-tictactoe
./build.sh
```

## Deploy contract on Calimero side
Example below deploys the contract to 90-calimero-testnet shard on Calimero
```
cd calimero-tictactoe
./build.sh
./deploy_calimero.sh 90
```

## Start game on NEAR testnet
```
near call tictactoe.igi.testnet register_player --accountId igi.testnet
near call tictactoe.igi.testnet register_player --accountId lala.testnet
```
The moment the second register_player is called, a cross shard call is about to be triggered which will start a game on Calimero shard

## Game is now being played on Calimero
Make moves e.g.:
```
calimero 90-calimero-testnet call tictactoe.90.calimero.testnet make_a_move --args '{"game_id":0,"selected_field":0}' --accountId igi.testnet
```

## Game ended
Once the game ends, a cross shard call to contract on NEAR testnet is executed, originated from Calimero shard. It denotes a game has ended and it shows who won and how the board looked like.
```
near view tictactoe.igi.testnet get_game --args '{"game_id":0}'
View call: tictactoe.igi.testnet.get_game({"game_id":0})
{
 board: [ [ 'O', 'X', 'U' ], [ 'O', 'X', 'U' ], [ 'O', 'U', 'U' ] ],
 player_a: 'igi.testnet',
 player_b: 'igi.testnet',
 status: 'PlayerAWon',
 player_a_turn: false
}
```



