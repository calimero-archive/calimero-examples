use near_contract_standards::non_fungible_token::metadata::TokenMetadata;
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap};
use near_sdk::env::{log, log_str};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseError,
    PromiseOrValue,
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
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Registrar {
    records: LookupMap<TokenId, OwnerMetadata>,
    pub nft_account: AccountId
}

#[near_bindgen]
impl Registrar {
    ///Initialize contract
    #[init]
    pub fn new(nft_account_id: AccountId) -> Self {
        env::log_str("Registrar init");
        assert!(!env::state_exists(), "Already initialized");

        Self {
            records: LookupMap::new(b"m"), //TODO what is good init?
            nft_account:nft_account_id
        }
    }

    /// Mint a new token with ID='token_id' belonging to 'receiver_id'
    #[payable]
    pub fn create_record(
        &mut self,
        token_id: TokenId,
        owner_metadata: OwnerMetadata,
        token_metadata: TokenMetadata,
    ) -> Promise {
        env::log_str("Registrar create record 222");
        env::log_str(&format!("Registrar token id:{}", token_id));
        // env::log_str(&format!("Registrar owner_metadata:{}", owner_metadata));

        let exists = self.records.contains_key(&token_id);
        env::log_str(&format!("Registrar token exists :{}", exists));
        // assert!(exists, "Token already exists!");

        let promise = ownership::ext(self.nft_account.clone())
            .with_static_gas(Gas(5 * TGAS))
            .with_attached_deposit(MIN_DEPOSIT_FOR_CREATE_RECORD)
            .nft_mint(token_id, owner_metadata.owner_id, token_metadata);

        return promise.then(
            Self::ext(env::current_account_id())
                .with_static_gas(Gas(5 * TGAS))
                .create_record_callback(),
        );
    }

    #[private]
    pub fn create_record_callback(
        &self,
        #[callback_result] call_result: Result<Token, PromiseError>,
    ) -> String {
        env::log_str("Registrar create_record_callback");
        // env::log_str(&format!(
        //     "Registrar create_record_callback result:{}",
        //     &call_result.unwrap_err().into()
        // ));

        // Check if the promise succeeded by calling the method outlined in external.rs
        if call_result.is_err() {
            log_str("There was an error contacting Ownership Contract");
            // let error = call_result.unwrap_err(); //for debugging purposes
            // env::log(&error.ref);s
            return "".to_string();
        }
        env::log_str("Registrar create_record_callback success");

        let token: Token = call_result.unwrap();
        token.owner_id.to_string()
    }

    /// Change owner
    #[payable]
    pub fn change_owner(
        &mut self,
        token_id: TokenId,
        owner_metadata: OwnerMetadata,
        token_metadata: TokenMetadata,
    ) -> Promise {
        env::log_str("Registrar change owner");
        env::log_str(&format!("Registrar change owner token_id:{}", token_id));

        ownership::ext(self.nft_account.clone())
            .with_static_gas(Gas(5 * TGAS))
            .with_attached_deposit(MIN_DEPOSIT_FOR_CHANGE_OWNER)
            .change_owner(token_id, owner_metadata.owner_id)
            .then(
                Self::ext(env::current_account_id())
                    .with_static_gas(Gas(5 * TGAS))
                    .change_owner_callback(),
            )
    }

    #[private]
    pub fn change_owner_callback(
        &mut self,
        #[callback_result] call_result: Result<(), PromiseError>,
    ) -> bool {
        env::log_str("Registrar change_owner_callback");

        // Return whether or not the promise succeeded using the method outlined in external.rs
        if call_result.is_err() {
            env::log_str("set_owner failed...");
            return true;
        } else {
            env::log_str("set_owner was successful!");
            return false;
        }
    }

    pub fn get_status(&self, token_id: TokenId) -> Option<OwnerMetadata> {
        env::log_str("Registrar get_status");
        return self.records.get(&token_id);
    }
}

// #[cfg(all(test, not(target_arch = "wasm32")))]
// mod registrar_tests;
