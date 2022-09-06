use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap};
use near_sdk::env::{log_str};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseError
};

pub mod external;
pub use crate::external::*;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault, Debug)]
pub struct RegistrarContract {
    metadata: LazyOption<OwnerMetadata>,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    TokenId,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}
#[near_bindgen]
#[derive(
    BorshDeserialize,
    BorshSerialize,
    PanicOnDefault,
    Serialize,
    Deserialize,
    Clone,
    Debug,
    PartialEq,
)]
#[serde(crate = "near_sdk::serde")]
pub struct OwnerMetadata {
    pub owner_id: AccountId,
    pub owner_full_name: String,
    pub address: String,
    pub item_type: String,
    pub item_size: String,
}

#[near_bindgen]
#[derive(
    BorshDeserialize,
    BorshSerialize,
    PanicOnDefault,
    Serialize,
    Deserialize,
    Clone,
    Debug,
    PartialEq,
)]
#[serde(crate = "near_sdk::serde")]
pub struct PropertyMetadata {
    pub address: String,
    pub item_type: String,
    pub item_size: String,
}

#[near_bindgen]
#[derive(
    BorshDeserialize,
    BorshSerialize,
    PanicOnDefault,
    Serialize,
    Deserialize,
    Clone,
    Debug,
    PartialEq,
)]
#[serde(crate = "near_sdk::serde")]
pub struct Metadata {
    pub owner_metadata: OwnerMetadata,
    pub property_metadata: PropertyMetadata,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Registrar {
    records: LookupMap<TokenId, Metadata>,
}

#[near_bindgen]
impl Registrar {
    ///Initialize contract
    #[init]
    pub fn new() -> Self {
        env::log_str("Registrar init");
        assert!(!env::state_exists(), "Already initialized");
        Self {
            records: LookupMap::new(b"m"),
        }
    }

    /// Mint a new token with ID='token_id' belonging to 'receiver_id'
    #[payable]
    pub fn create_record(
        &mut self,
        ref token_id: TokenId,
        ref metadata: Metadata,
        ref token_metadata: TokenMetadata,
    ) -> Promise {
        env::log_str("Registrar create record");
        env::log_str(&format!("Registrar token id:{}", token_id));

        let exists = self.records.contains_key(&token_id);
        env::log_str(&format!("Registrar token exists :{}", exists));
        assert!(!exists, "Token already exists!");

        let promise = ownership::ext(metadata.owner_metadata.owner_id.clone())
            .with_static_gas(Gas(5 * TGAS))
            .with_attached_deposit(MIN_DEPOSIT_FOR_CREATE_RECORD)
            .nft_mint(
                token_id.to_string(),
                metadata.owner_metadata.owner_id.clone(),
                token_metadata.to_owned(),
            );

        return promise.then(
            Self::ext(env::current_account_id())
                .with_static_gas(Gas(5 * TGAS))
                .create_record_callback(token_id.to_string(), metadata.clone()),
        );
    }

    #[private]
    pub fn create_record_callback(
        &mut self,
        token_id: TokenId,
        metadata: Metadata,
        #[callback_result] call_result: Result<Token, PromiseError>,
    ) -> String {
        env::log_str("Registrar create_record_callback");

        let record = self.records.contains_key(&token_id);
        assert!(!record, "Record already exists");

        if call_result.is_err() {
            log_str("There was an error contacting Ownership Contract");
            return "".to_string();
        }
        env::log_str("Registrar create_record_callback success");
        self.records.insert(&token_id, &metadata);

        env::log_str("Created new record.");

        let token: Token = call_result.unwrap();
        token.owner_id.to_string()
    }

    /// Change owner
    #[payable]
    pub fn change_owner(&mut self, ref token_id: TokenId, ref metadata: Metadata) -> Promise {
        env::log_str("Registrar change owner");
        env::log_str(&format!(
            "Registrar change owner token_id:{}",
            token_id.to_string()
        ));

        let promise = ownership::ext(metadata.owner_metadata.owner_id.clone())
            .with_static_gas(Gas(5 * TGAS))
            .with_attached_deposit(MIN_DEPOSIT_FOR_CREATE_RECORD)
            .get_owner(token_id.to_string());

        return promise.then(
            Self::ext(env::current_account_id())
                .with_static_gas(Gas(5 * TGAS))
                .change_owner_callback(token_id.to_string(), metadata.clone()),
        );
    }

    #[private]
    pub fn change_owner_callback(
        &mut self,
        token_id: TokenId,
        metadata: Metadata,
        #[callback_result] call_result: Result<AccountId, PromiseError>,
    ) -> String {
        env::log_str("Registrar change_owner_callback");

        if call_result.is_err() {
            log_str("There was an error fetching NFT owner");
            return "".to_string();
        }

        let owner_id: AccountId = call_result.unwrap();

        assert!(
            owner_id == env::signer_account_id(),
            "Only owner can change metadata"
        );

        //Change owner
        self.records.remove(&token_id);
        self.records.insert(&token_id, &metadata);

        return format!("{}{}", "New owner is: ", metadata.owner_metadata.owner_id);
    }

    pub fn get_status(&self, token_id: TokenId) -> Option<Metadata> {
        env::log_str("Registrar get_status");
        return self.records.get(&token_id);
    }
}

// #[cfg(all(test, not(target_arch = "wasm32")))]
// mod registrar_tests;
