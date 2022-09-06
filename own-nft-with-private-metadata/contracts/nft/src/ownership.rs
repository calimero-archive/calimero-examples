use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LazyOption;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault, Promise, PromiseOrValue,
};

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
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct OwnershipContract {
    tokens: NonFungibleToken,
    contractMetadata: LazyOption<NFTContractMetadata>,
    properyMetadata: PropertyMetadata,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}

#[near_bindgen]
impl OwnershipContract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId, property_metadata: PropertyMetadata) -> Self {
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "Ownership non-fungible token".to_string(),
                symbol: "ONFT".to_string(),
                icon: None,
                base_uri: None,
                reference: None,
                reference_hash: None,
            },
            property_metadata,
        )
    }

    ///Initialize contract
    #[init]
    pub fn new(
        owner_id: AccountId,
        metadata: NFTContractMetadata,
        property_metadata: PropertyMetadata,
    ) -> Self {
        env::log_str("NFT init");
        assert!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        Self {
            tokens: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            contractMetadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            properyMetadata: property_metadata,
        }
    }

    /// Mint a new token with ID='token_id' belonging to 'receiver_id'
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        owner_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        env::log_str("NFT Mint");
        env::log_str(&format!("NFT Mint nft token id:{}", token_id));
        env::log_str(&format!("NFT Mint nft owner id:{}", owner_id));

        return self
            .tokens
            .internal_mint(token_id, owner_id, Some(token_metadata));
    }

    /// return current owner
    pub fn get_owner(&self) -> AccountId {
        env::log_str(&format!("NFT Current owner:{}", env::current_account_id()));
        return self.tokens.owner_id.clone();
    }
}

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for OwnershipContract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.contractMetadata.get().unwrap()
    }
}

near_contract_standards::impl_non_fungible_token_core!(OwnershipContract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(OwnershipContract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(OwnershipContract, tokens);

#[cfg(all(test, not(target_arch = "wasm32")))]
mod ownership_tests;
