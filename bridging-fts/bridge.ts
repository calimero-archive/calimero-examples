import { Near } from 'near-api-js';
import * as nearAPI from 'near-api-js';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers/provider';
import * as fs from 'fs';
import * as os from 'os';
import * as big from 'bn.js';
import { FunctionCallOptions } from 'near-api-js/lib/account';

const MAX_GAS_LIMIT = '300000000000000';

export interface FinalExecutionOutcomeView extends FinalExecutionOutcome {
    receipts: any,
}

export class BridgeService {
    // network from where the tokens are being transferred 
    sourceBlockchain!: Near;
    // contract id of the source ft_connector
    sourceFtConnectorContractId!: string;
    // source blockchain id
    sourceNetworkId!: string;
    // network to where the tokens are being transferred 
    destinationBlockchain!: Near;
    // destination blockchain id
    destinationNetworkId!: string;
    // contract id of the destination ft_connector
    destinationFtConnectorContractId!: string;
    // keystore on source
    sourceKeystore!: any;
    // keystore on destination
    destinationKeystore!: any;

    async initialize(
        sourceBlockchainEndpoint: string,
        sourceNetworkId: string,
        sourceFtConnectorContractAccountId: string,
        destinationBlockchainEndpoint: string,
        destinationNetworkId: string,
        destinationFtConnectorContractId: string,
        destinationAuthApiKey: string,
    ): Promise<void> {
        this.sourceKeystore = new nearAPI.keyStores.InMemoryKeyStore();

        this.sourceBlockchain = await nearAPI.connect({
            nodeUrl: sourceBlockchainEndpoint,
            networkId: sourceNetworkId,
            deps: {
                keyStore: this.sourceKeystore,
            },
            headers: {
            },
        });

        this.sourceFtConnectorContractId = sourceFtConnectorContractAccountId;

        this.sourceNetworkId = sourceNetworkId;

        this.destinationKeystore = new nearAPI.keyStores.InMemoryKeyStore();

        this.destinationBlockchain = await nearAPI.connect({
            nodeUrl: destinationBlockchainEndpoint,
            networkId: destinationNetworkId,
            deps: {
                keyStore: this.destinationKeystore,
            },
            headers: {
                'x-api-key': destinationAuthApiKey,
            },
        });

        this.destinationNetworkId = destinationNetworkId;

        this.destinationFtConnectorContractId = destinationFtConnectorContractId;

        console.log('initialized');
        Promise.resolve();
    }

    async transferFungibleTokenToDestinationConnector(account: string, contractId: string, amount: string) {
        console.log('Transferring to ft_connector_source contract:', this.sourceFtConnectorContractId);

        const memo = null;
        const msg = this.sourceNetworkId;
        const networkId = this.sourceNetworkId;

        // Provide sender private key
        const senderPrivateKey = os.homedir() + `/.near-credentials/${this.sourceNetworkId}/${account}.json`;

        const accountKey = JSON.parse(fs.readFileSync(senderPrivateKey, 'utf-8'));
        this.sourceKeystore.setKey(
            networkId,
            accountKey.account_id,
            new KeyPairEd25519(accountKey.private_key.split(':')[1]),
        );

        const senderAccount = await this.sourceBlockchain.account(accountKey.account_id);

        try {
            // ft_transfer_call
            const callFtTransferCallOnSource: FunctionCallOptions = {
                contractId: contractId,
                methodName: 'ft_transfer_call',
                args: {
                    receiver_id: this.sourceFtConnectorContractId,
                    amount: amount,
                    memo: memo,
                    msg: msg,
                },
                attachedDeposit: new big.BN('1'),
                gas: new big.BN(MAX_GAS_LIMIT),
            };

            const transferTokensTx = await senderAccount.functionCall(callFtTransferCallOnSource);
            console.log('Locked tokens to ft_connector_source contract on NEAR Testnet, tokens will be minted on Calimero side in a few seconds!');
            console.log('Lock tx hash:', transferTokensTx.transaction.hash);
            console.log('===================');
        } catch (error) {
            console.log(error);
            console.log('Failed locking FT to on the ft_connector_source contract');
        }
    }

    async transferFungibleTokenToSourceConnector(account: string, sourceContractId: string, amount: string) {
        const networkId = this.destinationNetworkId;

        // Provide sender priv key
        const senderPrivateKey = os.homedir() + `/.near-credentials/${this.destinationNetworkId}/${account}.json`;

        const accountKey = JSON.parse(fs.readFileSync(senderPrivateKey, 'utf-8'));
        this.destinationKeystore.setKey(
            networkId,
            accountKey.account_id,
            new KeyPairEd25519(accountKey.private_key.split(':')[1]),
        );

        const senderAccount = await this.destinationBlockchain.account(accountKey.account_id);

        const contractId = await senderAccount.viewFunction(
            this.destinationFtConnectorContractId,
            'view_mapping',
            { source_account: sourceContractId }
        );
        console.log('On destination chain this is the FT bridge contract for ' + sourceContractId + ':', contractId);
        console.log('Withdrawing from Calimero to NEAR Testnet...');

        const withdrawMethod = 'withdraw';
        try {
            // withdraw
            const callWithdrawOnDestination: FunctionCallOptions = {
                contractId: contractId,
                methodName: withdrawMethod,
                args: {
                    amount: amount,
                },
                attachedDeposit: new big.BN('1'),
                gas: new big.BN(MAX_GAS_LIMIT),
            };

            const transferTokensTx = await senderAccount.functionCall(callWithdrawOnDestination);
            console.log('Withdrawn tokens from Calimero, token will be unlocked on NEAR Testnet in a few seconds!');
            console.log(transferTokensTx.transaction.hash);
            console.log('===================');
        } catch (error) {
            console.log(error);
            console.log('Failed transferring FT back to NEAR Testnet from Calimero');
        }
    }

}