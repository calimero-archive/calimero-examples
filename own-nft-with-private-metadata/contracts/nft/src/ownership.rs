use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LazyOption;
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault, Promise, PromiseOrValue,
};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct OwnershipContract {
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
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
    pub fn new_default_meta(owner_id: AccountId) -> Self {
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
        )
    }

    ///Initialize contract
    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
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
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
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

    /// Update token
    #[payable]
    pub fn change_owner(&mut self, token_id: TokenId, new_owner_id: AccountId) {
        env::log_str("NFT Change owner");
        env::log_str(&format!("NFT Change owner token id:{}", token_id));
        env::log_str(&format!("NFT Change owner new_owner_id:{}", new_owner_id));

        let sender_id = env::signer_account_id();
        env::log_str(&format!("NFT Change owner sender_id:{}", sender_id));

        let current_owner = self.get_owner();
        //ziher se ne radi ovak
        let is_sender_owner_of_token = current_owner == sender_id;
        env::log_str(&format!(
            "NFT Change owner is_sender_owner_of_token:{}",
            is_sender_owner_of_token
        ));
        assert!(is_sender_owner_of_token, "Only owner can update NFT",);

        self.tokens
            .internal_transfer(&sender_id, &new_owner_id, &token_id, None, None);
    }
}

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for OwnershipContract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}

near_contract_standards::impl_non_fungible_token_core!(OwnershipContract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(OwnershipContract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(OwnershipContract, tokens);

#[cfg(all(test, not(target_arch = "wasm32")))]
mod ownership_tests;
