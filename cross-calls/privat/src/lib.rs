/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use std::convert::TryInto;


use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde_json::json;
use near_sdk::{ near_bindgen, Timestamp, Gas, Balance, serde_json};
use near_sdk::collections::Vector;
use near_sdk::collections::UnorderedMap;
use near_sdk::AccountId;
use near_sdk::env::{panic_str, signer_account_id, block_timestamp_ms};
use sha2::{Sha256, Digest};
use near_sdk::env;


const DESTINATION_CONTRACT_ID: &str = "etopict.testnet"; //"dev-1662471437541-86282131349740";
const DESTINATION_CONTRACT_METHOD: &str = "add_correct_answers";
//const DESTINATION_CONTRACT_ARGS: String = "";
const DESTINATION_GAS: Gas = Gas(20_000_000_000_000);
const DESTINATION_DEPOSIT: Balance = 0;
const NO_DEPOSIT: Balance = 0;
const CROSS_CALL_GAS: Gas = Gas(20_000_000_000_000);
// use near_sdk::serde::{Deserialize, Serialize};

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Competition{
    name: String,
    active: bool,
    type_comp:   u8, //0 for pre-o, 1 for temp-o, 2 for pre-o sprint
    time_start: u64,
    time_end: u64,
    answers: Vector<String>,
    answers_hesh: Vec<u8>,
    results: Option<UnorderedMap<AccountId, Result>>
}

/* 
let mut x = ...
x.results = Some(...)
x.results.unwrap.
*/

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Result{
    answer: UnorderedMap<String,String>,
    timestamp_answer: UnorderedMap<String,u64>,
    start: Timestamp,
    finish: Option<Timestamp>,
}

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    competitions: UnorderedMap<u32, Competition>,
}

// Define the default, which automatically initializes the contract
impl Default for Contract{
    fn default() -> Self{
        Self{
            competitions: UnorderedMap::new(b"m"),
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    // Public method - returns the greeting saved, defaulting to DEFAULT_MESSAGE
    pub fn create_comp(&mut self, nameIn: String, typecomp: u8, timestart: Timestamp, timeend: Timestamp, answers: Vec<String>){
        let answer = jsonToBorch(answers.clone());
        let mut hasher = Sha256::new();
        hasher.update(&answers.clone().into_iter().map(|s|  s.into_bytes()).flatten().collect::<Vec<_>>());
        let rezult = hasher.finalize();
        let x = rezult.as_slice();
        let id = self.competitions.len();
        self.competitions.insert(&(id.try_into().unwrap()), 
        &Competition { name: nameIn, active: false, 
            type_comp: typecomp, time_start: timestart, 
            time_end: timeend,answers: answer, answers_hesh: x.to_vec(),
             results: None});             
    }


    pub fn startcomp_user(&self, key: u32){
        let comp = self.competitions.get(&key).unwrap();
        let mut result = comp.results.unwrap();
        result.insert(&signer_account_id(),
         &Result {answer: UnorderedMap::new(b"s"), 
         timestamp_answer:UnorderedMap::new(b"g"), 
         start: block_timestamp_ms(), finish: None});
    }

    pub fn answers(&self, key: u32, name: String, answer:String){
        let comp = self.competitions.get(&key).unwrap();
        let mut rez= comp.results.unwrap().get(&signer_account_id()).unwrap();
        let x = rez.answer.get(&name);
        if x.is_none(){
            rez.answer.insert(&name, &answer);
            rez.timestamp_answer.insert(&name, &block_timestamp_ms());
        }else {
            rez.answer.remove(&name);
            rez.timestamp_answer.remove(&name);
            rez.answer.insert(&name, &answer);
            rez.timestamp_answer.insert(&name, &block_timestamp_ms());
        }
    }

    pub fn comp_start(&self, key: u32){
        let mut comp = self.competitions.get(&key).unwrap();
        if comp.time_start<block_timestamp_ms() {
            comp.active = true;    
        }else {panic_str("to early")};
    }

    pub fn comp_finish(&self, key: u32){
        let mut comp = self.competitions.get(&key).unwrap();
        if comp.time_end>block_timestamp_ms() {
            comp.active = false;
            env::promise_return(env::promise_create(
                AccountId::new_unchecked("xsc_connector.TODO.testnet".to_string()//TODO
                //AccountId::new_unchecked("dev-1662472041989-87785428528272".to_string()
            ),
                "cross_call",
                &serde_json::to_vec(&(
                    DESTINATION_CONTRACT_ID, 
                    DESTINATION_CONTRACT_METHOD, 
                    json!({"key":key, "answers":comp.answers.to_vec()}).to_string(), 
                    DESTINATION_GAS, 
                    DESTINATION_DEPOSIT)).unwrap(),
                NO_DEPOSIT,
                CROSS_CALL_GAS,
            ));
        }else {panic_str("to early")};
    }
    
}
    pub fn jsonToBorch(json: Vec<String>)->Vector<String>{
    let mut vector: Vector<String>=Vector::new(b"q");
    json.iter().for_each(|el|{
        vector.push(el)
    });
    return vector;
}

/*pub fn jsonToBorchRezults(mut json: Vec<ResultJson>)->Vector<Result>{
    let mut vector: Vector<Result>=Vector::new(b"p");
    json.iter_mut().for_each(|el|{
        
        let answresults = jsonToBorch(el.answer.clone());

        vector.push(&Result { answer: answresults, answer_hesh: el.answer_hesh.clone(), start: el.start, finish: el.finish, correct: el.correct, time: el.time, penalty: el.penalty, place: el.place })
        
    });
    return vector;
}*/


    
