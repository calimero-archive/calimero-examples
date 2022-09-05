extern crate near_sdk;

use std::collections::{HashSet, HashMap};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Poll {
    question: String,
    options: HashSet<String>
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct PollData {
    poll: Poll,
    results: HashMap<String, u32>,
    voted: HashSet<AccountId>
}

#[near_bindgen]
impl PollData {
    #[init]
    pub fn new(question: String, options: HashSet<String>) -> Self {
        let sz = options.len();
        Self {
            poll: Poll {question: question, options: options},
            results: HashMap::with_capacity(sz),
            voted: HashSet::new()
        }
    }

    pub fn get_poll(&self) -> Poll {
        return self.poll.clone();
    }

    pub fn get_results(self) -> HashMap<String, u32> {
        return self.results.clone();
    }

    pub fn vote(&mut self, option: String) {
        let acc_id = env::signer_account_id();

        require!(self.voted.insert(acc_id), "Already voted!");

        require!(self.poll.options.contains(&option), "Invalid option!");

        let new_val = self.results.entry(option).or_insert(0);
        *new_val += 1;
    }
}
