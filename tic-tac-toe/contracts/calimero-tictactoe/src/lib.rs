//! Tic tac toe contract built during hackathon

extern crate near_sdk;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault, Gas, Balance};
use near_sdk::serde_json::{json, self};
use calimero_sdk::{calimero_cross_shard_connector, calimero_cross_call_execute};

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
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize, Clone)]
pub struct TicTacToe {
    games: Vec<Game>,
}

const DESTINATION_CONTRACT_ID: &str = "tictactoe.igi.testnet"; // tictactoe on testnet
const DESTINATION_CONTRACT_METHOD: &str = "game_ended";
const DESTINATION_GAS: Gas = Gas(50_000_000_000_000);
const DESTINATION_DEPOSIT: Balance = 0;
const CROSS_CALL_GAS: Gas = Gas(150_000_000_000_000);

calimero_cross_shard_connector!("xsc_connector.lal89.calimero.testnet");

#[near_bindgen]
impl TicTacToe {
    #[init]
    pub fn new() -> Self {
        Self {
            games: Vec::new()
        }
    }

    pub fn num_of_games(&self) -> usize {
        return self.games.len();
    }

    pub fn get_game(&self, game_id: usize) -> Game {
        require!(game_id < self.games.len());
        self.games[game_id].clone()
    }

    pub fn start_game(&mut self, player_a: AccountId, player_b: AccountId) -> usize {
        let empty_game = Game {
            board: vec![
                vec![BoardField::U, BoardField::U, BoardField::U], 
                vec![BoardField::U, BoardField::U, BoardField::U], 
                vec![BoardField::U, BoardField::U, BoardField::U]
            ],
            player_a: player_a,
            player_b: player_b,
            status: GameStatus::InProgress,
            player_a_turn: true
        };
        self.games.push(empty_game);
        self.games.len() - 1
    }

    pub fn make_a_move(&mut self, game_id: usize, selected_field: usize) {
        require!(selected_field < 9);
        require!(game_id < self.games.len());

        let selected_game = &mut self.games[game_id];
        if selected_game.player_a_turn {
            require!(env::predecessor_account_id() == selected_game.player_a);
        } else {
            require!(env::predecessor_account_id() == selected_game.player_b);
        }

        let row = selected_field / 3;
        let col = selected_field % 3;

        env::log_str(&format!("{} MADE A MOVE: {} {}", env::predecessor_account_id(), row, col));

        require!(selected_game.board[row][col] == BoardField::U, "Tried overwriting a field on the board!");

        selected_game.board[row][col] = if selected_game.player_a_turn {
            BoardField::O
        } else {
            BoardField::X
        };

        selected_game.player_a_turn = !selected_game.player_a_turn;
        self.check_if_ended(game_id);
    }

    fn check_if_ended(&mut self, game_id: usize) -> bool {
        require!(game_id < self.games.len());
        let selected_game = &mut self.games[game_id];

        if selected_game.status != GameStatus::InProgress {
            return true;
        }

        for i in 0..3 {
            if selected_game.board[i][0] == selected_game.board[i][1] &&
              selected_game.board[i][1] == selected_game.board[i][2] &&
              selected_game.board[i][2] != BoardField::U {
                selected_game.status = TicTacToe::announce_victory(selected_game.board[i][0], selected_game);
            }
        }

        for i in 0..3 {
            if selected_game.board[0][i] == selected_game.board[0][i] &&
              selected_game.board[1][i] == selected_game.board[2][i] &&
              selected_game.board[2][i] != BoardField::U {
                selected_game.status = TicTacToe::announce_victory(selected_game.board[0][i], selected_game);
            }
        }
        
        if selected_game.board[0][0] == selected_game.board[1][1] &&
            selected_game.board[1][1] == selected_game.board[2][2] &&
            selected_game.board[0][0] != BoardField::U {
                selected_game.status = TicTacToe::announce_victory(selected_game.board[0][0], selected_game);
        } else if selected_game.board[0][2] == selected_game.board[1][1] &&
            selected_game.board[1][1] == selected_game.board[2][0] &&
            selected_game.board[0][2] != BoardField::U {
                selected_game.status = TicTacToe::announce_victory(selected_game.board[0][2], selected_game);
        }

        let mut tie = true;
        for i in 0..3 {
            for j in 0..3 {
                if selected_game.board[i][j] == BoardField::U {
                    tie = false;
                }
            }
        }

        if selected_game.status == GameStatus::InProgress && tie {
            env::log_str(&format!("ITS A TIE"));
            selected_game.status = GameStatus::Tie;
        }

        if selected_game.status != GameStatus::InProgress {
            let args = json!({"game_id":game_id,"game":selected_game});

            calimero_cross_call_execute!(
                DESTINATION_CONTRACT_ID,
                DESTINATION_CONTRACT_METHOD,
                args,
                DESTINATION_GAS,
                DESTINATION_DEPOSIT,
                "callback_game_ended",
                CROSS_CALL_GAS
            );
        }

        selected_game.status == GameStatus::InProgress 
    }

    fn announce_victory(winner_symbol: BoardField, current_game: &Game) -> GameStatus {
        require!(winner_symbol != BoardField::U);

        if winner_symbol == BoardField::O {
            env::log_str(&format!("{} WON", current_game.player_a));

            return GameStatus::PlayerAWon;
        } else {
            env::log_str(&format!("{} WON", current_game.player_b));

            return GameStatus::PlayerBWon;
        }
    }

    pub fn callback_game_ended() {
        env::log_str(&format!("got a callback that game_ended was called on testnet {}", env::predecessor_account_id()));
    }
    
}
