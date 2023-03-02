//! Tic tac toe contract built during hackathon

extern crate near_sdk;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault, Gas, Balance};
use near_sdk::serde_json::{json, self};
use calimero_sdk::{calimero_cross_shard_connector, calimero_cross_call_execute, calimero_expand};

#[derive(BorshDeserialize, BorshSerialize, PartialEq, Eq, Copy, Clone, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub enum BoardField {
    X,
    O,
    U
}

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
    board: Vec<Vec<BoardField>>,
    player_a: AccountId, // player A is always O
    player_b: AccountId, // player B is always X
    status: GameStatus,
    player_a_turn: bool, // if true, player A's turn, else player B's turn
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct TicTacToe {
    finished_games: LookupMap<usize, Game>,
    all_games: UnorderedSet<usize>,
    player_awaiting_for_opponent: Option<AccountId>,
}

const DESTINATION_CONTRACT_ID: &str = "tictactoe.demos.calimero.testnet"; // tictactoe on calimero
const DESTINATION_CONTRACT_METHOD: &str = "start_game";
const DESTINATION_GAS: Gas = Gas(50_000_000_000_000);
const DESTINATION_DEPOSIT: Balance = 0;
const CROSS_CALL_GAS: Gas = Gas(100_000_000_000_000);

calimero_cross_shard_connector!("xsc_connector.demos.calimero.testnet");

#[calimero_expand]
#[near_bindgen]
impl TicTacToe {
    #[init]
    pub fn new() -> Self {
        Self {
            finished_games: LookupMap::new(b"f"),
            all_games: UnorderedSet::new(b"a"),
            player_awaiting_for_opponent: None,
        }
    }

    pub fn num_of_all_games(&self) -> u64 {
        self.all_games.len()
    }

    pub fn get_finished_game(&self, game_id: usize) -> Option<Game> {
        if !self.finished_games.contains_key(&game_id) {
            None
        } else {
            Some(self.finished_games.get(&game_id).unwrap().clone())
        }
    }

    pub fn register_player(&mut self) {
        if let Some(first_player) = self.player_awaiting_for_opponent.clone() {

            self.player_awaiting_for_opponent = None;

            let args = json!({"player_a":first_player,"player_b":env::predecessor_account_id()});

            calimero_cross_call_execute!(
                DESTINATION_CONTRACT_ID,
                DESTINATION_CONTRACT_METHOD,
                args,
                DESTINATION_GAS,
                DESTINATION_DEPOSIT,
                "game_started",
                CROSS_CALL_GAS
            );
        } else {
            self.player_awaiting_for_opponent = Some(env::predecessor_account_id());
        }
    }

    #[calimero_receive_response]
    pub fn game_started(&mut self, game_id: usize) {
        self.all_games.insert(&game_id);
    }

    pub fn game_ended(&mut self, game_id: usize, game: Game) {
        require!(env::predecessor_account_id().to_string() == CROSS_SHARD_CALL_CONTRACT_ID);
        env::log_str(&format!("game ended, called by the connector {}", env::predecessor_account_id()));
        self.finished_games.insert(&game_id, &game); 
    }
    
}
