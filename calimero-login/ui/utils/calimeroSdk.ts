import { CalimeroSdk } from "calimero-sdk";

export default CalimeroSdk.init({
  shardId: "lal89-calimero-testnet",
  walletUrl: "https://localhost:1234",
  //@ts-ignore
  calimeroUrl: process.env.NEXT_PUBLIC_CALIMERO_NODE_BASE,
  //@ts-ignore
  calimeroWebSdkService: process.env.NEXT_PUBLIC_CALIMERO_WEB_SDK_SERVICE_URL,
});
