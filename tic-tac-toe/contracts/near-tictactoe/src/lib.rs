//! Tic tac toe contract built during hackathon

extern crate near_sdk;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault, Gas, Balance};
use near_sdk::serde_json::{json, self};

#[derive(BorshDeserialize, BorshSerialize, PartialEq, Eq, Serialize, Deserialize, Clone, Copy)]
#[serde(crate = "near_sdk::serde")]
pub enum GameStatus {
    InProgress,
    PlayerAWon,
    PlayerBWon,
    Tie
}

#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Game {
    player_a: AccountId, // player A is always O
    player_b: AccountId, // player B is always X
    status: GameStatus,
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct TicTacToe {
    games: LookupMap<u64, Game>,
    player_awaiting_for_opponent: Option<AccountId>,
}

const DESTINATION_CONTRACT_ID: &str = "tictactoe.hackathon7.calimero.testnet"; //"dev-1662471437541-86282131349740";
const DESTINATION_CONTRACT_METHOD: &str = "start_game";
//const DESTINATION_CONTRACT_ARGS: String = "";
const DESTINATION_GAS: Gas = Gas(20_000_000_000_000);
const DESTINATION_DEPOSIT: Balance = 0;
const NO_DEPOSIT: Balance = 0;
const CROSS_CALL_GAS: Gas = Gas(20_000_000_000_000);
// source_callback_method

#[near_bindgen]
impl TicTacToe {
    #[init]
    pub fn new() -> Self {
        Self {
            games: LookupMap::new(b"m"),
            player_awaiting_for_opponent: None,
        }
    }

    // pub fn get_game(&self, game_id: usize) -> Game {
    //     require!(game_id < self.games.len());
    //     self.games[game_id].clone()
    // }

    pub fn register_player(&mut self) {
        if let Some(first_player) = self.player_awaiting_for_opponent.clone() {

            self.player_awaiting_for_opponent = None;

            env::promise_return(env::promise_create(
                AccountId::new_unchecked("xsc_connector.hackathon7.apptest-development.testnet".to_string()
                //AccountId::new_unchecked("dev-1662472041989-87785428528272".to_string()
            ),
                "cross_call",
                &serde_json::to_vec(&(
                    DESTINATION_CONTRACT_ID, 
                    DESTINATION_CONTRACT_METHOD, 
                    json!({"player_a":first_player,"player_b":env::predecessor_account_id()}).to_string(), 
                    DESTINATION_GAS, 
                    DESTINATION_DEPOSIT, 
                    "game_started")).unwrap(),
                NO_DEPOSIT,
                CROSS_CALL_GAS,
            ));
        } else {
            self.player_awaiting_for_opponent = Some(env::predecessor_account_id());
        }
    }

    pub fn game_started(&self, response: Option<Vec<u8>>) {
        if response.is_none() {
            // Call ti je failao na drugoj strani, radi sta hoces
        } else {
            let as_json: usize = near_sdk::serde_json::from_slice::<usize>(&response.unwrap()).unwrap();
            env::log_str(&format!("DOBIO CALLBACK {}", as_json));

            //games.insert(as_json, Game);
        }
    }
    
}
