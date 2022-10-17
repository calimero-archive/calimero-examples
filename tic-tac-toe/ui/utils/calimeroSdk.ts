import { CalimeroSdk } from "calimero-auth-sdk";

export default CalimeroSdk.init({
  shardId: "k-calimero-testnet",
  walletUrl: "https://localhost:1234",
  //@ts-ignore
  calimeroUrl: process.env.NEXT_PUBLIC_CALIMERO_NODE_BASE,
  //@ts-ignore
  calimeroWebSdkService: process.env.NEXT_PUBLIC_CALIMERO_NODE_BASE,
});
