use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LazyOption;
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault, Promise, PromiseOrValue,
};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct RegistrarContract {
    metadata: LazyOption<TokenMetadata>
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    TokenId,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}

pub struct OwnerMetadata {
    pub owner_id: AccountId,
    pub owner_full_name: String,
    pub address: String,
    pub item_type: String,
    pub item_size: String,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Registrar {
    records: LookupMap<TokenId, OwnerMetadata>
}

#[near_bindgen]
impl Registrar {

    ///Initialize contract
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        Self {
            records: LookupMap::new(),
        }
    }

    /// Mint a new token with ID='token_id' belonging to 'receiver_id'
    #[payable]
    pub fn create_record(
        &mut self,
        token_id: TokenId,
        OwnerMetadata: OwnerMetadata
    ) -> Token {
        return self.tokens
            .nft_mint(token_id, Some(token_metadata))
    }

    pub fn create_record_callback(&self, #[callback_result] call_result: Result<String, PromiseError>) -> Token {
        // Check if the promise succeeded by calling the method outlined in external.rs
        if call_result.is_err() {
            log!("There was an error contacting Ownership Contract");
            return call_result.is_err().to_string(); //for debugging purposes
        }
        let token: Token = call_result.unwrap();
        token
    }

    /// Change owner
    #[payable]
    pub fn change_owner(
        &mut self,
        token_id: TokenId,
        owner_metadata: OwnerMetadata,
    ) -> Token {
        //fetch token_id owner
        let token_owner = self.token.get_owner

        //if token owner is === current_owner_id then update record
        assert!(owner_metadata.owner_id != token_owner, "Only token owner can update metadata.");

        //update metadata
        self.tokens
            .nft_mint(token_id, receiver_id, Some(token_metadata))
    }

    #[private]
    pub fn change_owner_callback(&mut self, #[callback_result] call_result: Result<(), PromiseError>) -> bool {
      // Return whether or not the promise succeeded using the method outlined in external.rs
      if call_result.is_err() {
        env::log_str("set_owner was successful!");
        return true;
      } else {
        env::log_str("set_owner failed...");
        return false;
      }
    }

    // // Public - query external owner
    // pub fn query_owner(&self) -> Promise {
    //     // Create a promise to call getOwner
    //     let promise = hello_near::ext(self.hello_account.clone())
    //     .with_static_gas(Gas(5*TGAS))
    //     .get_greeting();

    //     return promise.then( // Create a promise to callback query_greeting_callback
    //     Self::ext(env::current_account_id())
    //     .with_static_gas(Gas(5*TGAS))
    //     .query_greeting_callback()
    //     )
    // }

    // #[private] // Public - but only callable by env::current_account_id()
    // pub fn query_owner_callback(&self, #[callback_result] call_result: Result<String, PromiseError>) -> String {
    //     // Check if the promise succeeded by calling the method outlined in external.rs
    //     if call_result.is_err() {
    //         log!("There was an error contacting Ownership Contract");
    //         return "".to_string();
    //     }

    //     // Return the greeting
    //     let owner: String = call_result.unwrap();
    //     owner
    // }

}

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for RegistrarContract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod registrar_tests;
