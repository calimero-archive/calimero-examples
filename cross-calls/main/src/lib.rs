/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use std::convert::TryInto;


use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{log, near_bindgen, Timestamp};
use near_sdk::collections::Vector;
use near_sdk::collections::UnorderedMap;
use near_sdk::AccountId;
use near_sdk::collections::LazyOption;
use near_sdk::env::{panic_str, attached_deposit, signer_account_id, block_timestamp_ms};
use serde::Serialize;
use sha2::{Sha256, Digest};


// use near_sdk::serde::{Deserialize, Serialize};

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Competition{
    name: String,
    active: bool,
    official: u8, //0 for nonoficial, 1 for official, 2 for need check, 3 nonofficial by reject
    training: bool,
    type_comp:   u8, //0 for pre-o, 1 for temp-o, 2 for pre-o sprint
    time_start: u64,
    time_end: u64,
    starting_fee: u128,
    meta: LazyOption<CompMetadata>
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct CompMetadata{
    controls: Vector<ControlType>,
    answers: Option<Vector<String>>,
    answers_hesh: Vec<u8>,
    results: Option<UnorderedMap<AccountId, Result>>,
    results_hesh: Option<String>
}
/* 
let mut x = ...
x.results = Some(...)
x.results.unwrap.
*/

#[derive(near_sdk::serde::Serialize, near_sdk::serde::Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CompMetadataJson{
    controls: Vec<ControlTypeJson>,
    answers: Vec<String>,
    answers_hesh: Vec<u8>,
    results: Vec<ResultJson>,
    results_hesh: String
}


#[derive(BorshSerialize, BorshDeserialize)]
pub struct Result{
    answer: UnorderedMap<String,String>,
    timestamp_answer: UnorderedMap<String,u64>,
    answer_hesh: Option<String>,
    start: Timestamp,
    finish: Option<Timestamp>,
    correct: u8,
    time: Option<u64>,
    penalty: u64,
    place:  Option<u32> //write after competitions end
}
#[derive(Serialize)]
pub struct Rezult_out{
    start: Timestamp,
    finish: Option<Timestamp>,
    correct: u8,
    time: Option<u64>,
    penalty: u64,
    place:  Option<u32>,
    id: AccountId
}
#[derive(BorshSerialize, BorshDeserialize)]
pub struct ControlType{
    name: String,
    images: Vector<String>,
    images_hesh: Vector<String>,
    map: String,
    map_hesh: String,
    legend: String,
    legend_hesh: String,
    type_control: u8 //0 for regular, 1 for timed control, 2 for temp-o, 3 for pre-o sprint time-comtroled
}

#[derive(near_sdk::serde::Serialize, near_sdk::serde::Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ControlTypeJson {
    name: String,
    images: Vec<String>,
    images_hesh: Vec<String>,
    map: String,
    map_hesh: String,
    legend: String,
    legend_hesh: String,
    type_control: u8 //0 for regular, 1 for timed control, 2 for temp-o, 3 for pre-o sprint time-comtroled
}

#[derive(near_sdk::serde::Serialize, near_sdk::serde::Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ResultJson{
    answer: Vec<String>,
    answer_hesh: String,
    start: Timestamp,
    finish: Timestamp,
    correct: u8,
    time: u64,
    penalty: u64,
    place:  u32 //write after competitions end
}


#[derive(BorshDeserialize, BorshSerialize)]
pub struct Ranking{
    preo: f32,
    tempo: f32,
    preosprint: f32
}

#[derive(Clone, PartialEq, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CompShortOut{
    name: String,
    active: bool,
    official: u8, //0 for nonoficial, 1 for official, 2 for need check, 3 nonofficial by reject
    training: bool,
    type_comp:   u8, //0 for pre-o, 1 for temp-o, 2 for pre-o sprint
    time_start: u64,
    time_end: u64,
    starting_fee: u128,
    key: u32
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CompOut{
    name: String,
    active: bool,
    official: u8, //0 for nonoficial, 1 for official, 2 for need check, 3 nonofficial by reject
    training: bool,
    type_comp:   u8, //0 for pre-o, 1 for temp-o, 2 for pre-o sprint
    time_start: u64,
    time_end: u64,
    starting_fee: u128,
    key: u32,
    controls: Vec<ControlTypeJson> 

}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct UserProfile{
    id: u32,
    name: String,
    surname: String,
    club: u32,
    country: String, //3-leters code
    age: u32,
}
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Club{
    club_name: String
}
// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    users: UnorderedMap<AccountId, UserProfile>,
    clubs: UnorderedMap<u32, Club>,
    competitions: UnorderedMap<u32, Competition>,
    ranking: UnorderedMap<AccountId, Ranking>,
    need_check: Vector<u32>
}

// Define the default, which automatically initializes the contract
impl Default for Contract{
    fn default() -> Self{
        Self{
            users : UnorderedMap::new(b"u"),
            clubs :UnorderedMap::new(b"c"),
            competitions: UnorderedMap::new(b"m"),
            ranking:UnorderedMap::new(b"u"),
            need_check: Vector::new(b"n")
        }
    }
}


// Implement the contract structure
#[near_bindgen]
impl Contract {
    // Public method - returns the greeting saved, defaulting to DEFAULT_MESSAGE
    #[payable]
    pub fn create_comp(&mut self, nameIn: String, startingfee:u128, official: bool, treaning: bool, typecomp: u8, timestart: Timestamp, timeend: Timestamp, metadat: CompMetadataJson){
        //let answer = jsonToBorch(metadat.answers);
        let control = jsonToBorchControls(metadat.controls);
        let comp  = CompMetadata{controls:control, answers: None, answers_hesh: metadat.answers_hesh, results: None, results_hesh:None};

        let id = self.competitions.len();
        if official == true {
           if attached_deposit() >= 20*10u128.pow(24) {
                self.competitions.insert(&(id.try_into().unwrap()), &Competition { name: nameIn, active: false, starting_fee: startingfee, official: 2, training: treaning, type_comp: typecomp, time_start: timestart, time_end: timeend, meta: LazyOption::new(b"l",Some(&comp)) });
                self.need_check.push(&(id.try_into().unwrap()));   
           }else{ panic_str("add more tockens")}; 
        }else {
            let id = self.competitions.len();
            self.competitions.insert(&(id.try_into().unwrap()), &Competition { name: nameIn, active: false, starting_fee: startingfee, official: 1, training: treaning, type_comp: typecomp, time_start: timestart, time_end: timeend, meta: LazyOption::new(b"l",Some(&comp)) });
        }     
    }


    pub fn startcomp_user(&self, key: u32){
        let comp = self.competitions.get(&key).unwrap();
        if attached_deposit()>=comp.starting_fee*10u128.pow(24){
            comp.meta.get().unwrap().results.unwrap().insert(&signer_account_id(), &Result {answer: UnorderedMap::new(b"s"), timestamp_answer:UnorderedMap::new(b"g"), answer_hesh: None, start: block_timestamp_ms(), finish: None, correct: 0.try_into().unwrap(), time: None, penalty: 0.try_into().unwrap(), place: None })
        }else {panic_str("you dont pay start fee")};
    }

    pub fn answers(&self, key: u32, name: String, answer:String){
        let comp = self.competitions.get(&key).unwrap();
        let mut rez= comp.meta.get().unwrap().results.unwrap().get(&signer_account_id()).unwrap();
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
        }else {panic_str("to early")};
    }
    pub fn get_competitions_short(&self)->Vec<CompShortOut>{
        self.competitions.iter().map(|(key, value)| CompShortOut{
            name: value.name,
            active: value.active,
            official: value.official, //0 for nonoficial, 1 for official, 2 for need check, 3 nonofficial by reject
            training: value.training,
            type_comp: value.type_comp, //0 for pre-o, 1 for temp-o, 2 for pre-o sprint
            time_start: value.time_start,
            time_end: value.time_end,
            starting_fee: value.starting_fee,
            key: key
        }).collect()
    }
    
    pub fn get_competition_full(&self, key: u32)->CompOut{
        let comp = self.competitions.get(&key).unwrap();
        let controle =comp.meta.get().unwrap().controls;
        let control:Vec<ControlTypeJson> =controle.iter().map(|el| 
            ControlTypeJson{ name: el.name, images: el.images.to_vec(), images_hesh: el.images_hesh.to_vec(), map: el.map, map_hesh: el.map_hesh, legend: el.legend, legend_hesh: el.legend_hesh, type_control: el.type_control}
        ).collect();
        let comp_out = CompOut { name: comp.name, active: comp.active, official: comp.official, training: comp.training, type_comp: comp.type_comp, time_start: comp.time_start, time_end: comp.time_end, starting_fee: comp.starting_fee, key: key, controls: control };
        return comp_out;

    }   


    pub fn add_correct_answers(&self, key: u32, answers: Vec<String>){   
        let mut hasher = Sha256::new();
        hasher.update(&answers.clone().into_iter().map(|s|  s.into_bytes()).flatten().collect::<Vec<_>>());
        let rezult = hasher.finalize();
        let x = rezult.as_slice();
        let meta =self.competitions.get(&key).unwrap().meta.get().unwrap();
        if meta.answers_hesh==x{
            let mut answ =meta.answers.unwrap();
            answ.clear();
            answ = jsonToBorch(answers.clone());
           let rezult = meta.results.unwrap();
           for (k, mut v) in &rezult {
            for (i) in 0..answers.len(){
                let answers_vec = v.answer.values_as_vector();
                let leter = answers_vec.get(i.try_into().unwrap()).unwrap();
                if answers.get(i).unwrap()==&leter{
                    let b = v.correct.clone();
                    v.correct+=1;
                }else{
                    v.penalty+=1;
                }
            }
           }
        }else { panic_str("wrong answers") };
    }

    pub fn get_rezults_short(&self, key: u32) ->  Vec<Rezult_out>{
        self.competitions.get(&key).unwrap()
        .meta.get().unwrap()
        .results.unwrap().iter().map(|(k, v)| Rezult_out{
             start: v.start,
              finish: v.finish, 
              correct: v.correct, 
              time: v.time, 
              penalty: v.penalty, 
              place: v.place, 
              id: k 
            }).collect()
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


    
pub fn jsonToBorchControls(json: Vec<ControlTypeJson>)->Vector<ControlType>{
    let mut vector: Vector<ControlType>=Vector::new(b"w");
    json.iter().for_each(|el|{
        vector.push(&ControlType{name: el.name.clone(), images: jsonToBorch(el.images.clone()), images_hesh: jsonToBorch(el.images.clone()), map: el.map.clone(), map_hesh: el.map_hesh.clone(), legend: el.legend.clone(), legend_hesh: el.legend_hesh.clone(), type_control:el.type_control.clone() })
    });
return vector;
}

