use near_sdk::test_utils::{accounts, VMContextBuilder};
use near_sdk::testing_env;
use std::collections::HashMap;

near_contract_standards::impl_non_fungible_token_core!(RegistrarContract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(RegistrarContract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(RegistrarContract, tokens);

use super::*;

const MINT_STORAGE_COST: u128 = 5870000000000000000000;

fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
    let mut builder = VMContextBuilder::new();
    builder
        .current_account_id(accounts(0))
        .signer_account_id(predecessor_account_id.clone())
        .predecessor_account_id(predecessor_account_id);
    builder
}

fn sample_token_metadata() -> TokenMetadata {
    TokenMetadata {
        title: Some("Malehiko Great House".into()),
        description: Some("Biggest flat at round corner.".into()),
    }
}

#[test]
fn test_hello() {
    RegistrarContract::hello();
}

#[test]
fn test_new() {
    let mut context = get_context(accounts(1));
    testing_env!(context.build());
    let contract = RegistrarContract::new_default_meta(accounts(1).into());
    testing_env!(context.is_view(true).build());
    assert_eq!(contract.nft_token("1".to_string()), None);
}
