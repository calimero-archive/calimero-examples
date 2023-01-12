import { CalimeroSdk } from "calimero-sdk";

export const config = {
  shardId: "fran-calimero-testnet",
  walletUrl: "https://localhost:1234",
  calimeroUrl: "https://api.development.calimero.network",
  calimeroWebSdkService: "http://localhost:3000",
};

export default CalimeroSdk.init(config);