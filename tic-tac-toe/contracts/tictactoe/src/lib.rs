//! Tic tac toe contract built during hackathon

extern crate near_sdk;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault};

#[derive(BorshDeserialize, BorshSerialize)]
pub enum State {
    X,
    O,
    U
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct Game {
    state: Vec<Vec<State>>
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct TicTacToe {
    games: Vec<Game>,
}

#[near_bindgen]
impl TicTacToe {
    #[init]
    pub fn new() -> Self {
        Self {
            games: Vec::new(),
        }
    }

    pub fn num_of_games(&self) -> usize {
        return self.games.len();
    }

    pub fn add_game(&mut self) {
        let empty_game = Game {
            state: vec![
                vec![State::U, State::U, State::U], 
                vec![State::U, State::U, State::U], 
                vec![State::U, State::U, State::U]
            ]
        };
        self.games.push(empty_game);
    }
    
}
