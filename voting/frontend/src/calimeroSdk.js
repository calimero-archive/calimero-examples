import { CalimeroSdk } from "calimero-auth-sdk";

export default CalimeroSdk.init({
    shardId: "q3-calimero-testnet",
    walletUrl: "https://mnw-testnet.mynearwallet.com",
    calimeroUrl: "https://api.development.calimero.network",
    calimeroWebSdkService: "https://api.development.calimero.network",
});
