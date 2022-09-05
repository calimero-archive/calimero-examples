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

    ///Initialize contract
    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
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
        return self
            .tokens
            .internal_mint(token_id, owner_id, Some(token_metadata));
    }

    /// return current owner
    pub fn get_owner(&mut self) -> AccountId {
        return env::current_account_id();
    }

    /// Update token
    #[payable]
    pub fn change_owner(
        &mut self,
        token_id: TokenId,
        new_owner_id: AccountId,
    ) -> bool {
        let sender_id = env::signer_account_id();
        let current_owner = self.get_owner();
        //ziher se ne radi ovak
        let is_sender_owner_of_token = current_owner != sender_id;
        assert!(is_sender_owner_of_token, "Only owner can update NFT",);

        self.tokens.nft_transfer(
            new_owner_id,
            token_id.clone(),
            None,
            None,
        );

        return true; // TODO provjerit jel uspjesno il ne
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
