use near_sdk::{ext_contract};

pub const TGAS: u64 = 1_000_000_000_000;
pub const NO_DEPOSIT: u128 = 0;
pub const XCC_SUCCESS: u64 = 1;

// Interface of this contract, for callbacks
#[ext_contract(this_contract)]
trait Callbacks {
  fn change_owner_callback(&mut self) -> bool;
  fn create_record_callback(&mut self) -> Token;
}

// Validator interface, for cross-contract calls
#[ext_contract(hello_near)]
trait Ownership {
  #[payable]
  //fn get_owner(&mut self,token_id: TokenId) -> AccountId; //account id or just string?
  fn change_owner(&self,
    token_id: TokenId,
    current_owner_id: AccountId) -> TokenMetadata;
fn nft_mint(&self,
  token_id: TokenId,
  owner_id: AccountId,
  token_metadata: TokenMetadata);
}