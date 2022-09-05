use near_contract_standards::non_fungible_token::{metadata::TokenMetadata, Token, TokenId};
use near_sdk::{ext_contract, AccountId};

pub const TGAS: u64 = 1_000_000_000_000;
pub const NO_DEPOSIT: u128 = 0;
pub const MIN_DEPOSIT_FOR_CREATE_RECORD: u128 = 8000000000000000000000;
pub const MIN_DEPOSIT_FOR_CHANGE_OWNER: u128 = 1;
pub const XCC_SUCCESS: u64 = 1;

// Interface of this contract, for callbacks
#[ext_contract(this_contract)]
trait Callbacks {
    fn change_owner_callback(&mut self, token_id: TokenId, owner_metadata: crate::OwnerMetadata);
    fn create_record_callback(&mut self, token_id: TokenId, owner_metadata: crate::OwnerMetadata)
        -> Token;
}

// Validator interface, for cross-contract calls
#[ext_contract(ownership)]
trait Ownership {
    //fn get_owner(&mut self,token_id: TokenId) -> AccountId; //account id or just string?

    #[payable]
    fn change_owner(&mut self, token_id: TokenId, new_owner_id: AccountId) -> TokenMetadata;
    #[payable]
    fn nft_mint(
        &mut self,
        token_id: TokenId,
        owner_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token;
}
