import { BridgeService } from './bridge';
import { runPrompt } from './cli'

const env = process.env;

const sourceBlockchainEndpoint: string = env.SOURCE_RPC_ENDPOINT || "";
const sourceNetworkId: string = env.SOURCE_NETWORK_ID || "";
const sourceFtConnectorContractAccountId: string = env.SOURCE_FT_CONNECTOR_CONTRACT_ACCOUNT_ID || "";

const destinationBlockchainEndpoint: string = env.DESTINATION_RPC_ENDPOINT || "";
const destinationNetworkId: string = env.DESTINATION_NETWORK_ID || "";
const destinationFtConnectorContractAccountId: string = env.DESTINATION_FT_CONNECTOR_CONTRACT_ACCOUNT_ID || "";
const destinationAuthApiKey: string = env.DESTINATION_AUTH_API_KEY || "";


const bridge = new BridgeService();
bridge.initialize(
    sourceBlockchainEndpoint,
    sourceNetworkId,
    sourceFtConnectorContractAccountId,
    destinationBlockchainEndpoint,
    destinationNetworkId,
    destinationFtConnectorContractAccountId,
    destinationAuthApiKey,
).then(() => {
    runPrompt(bridge);
});
