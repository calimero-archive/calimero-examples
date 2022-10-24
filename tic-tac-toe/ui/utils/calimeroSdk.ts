import { CalimeroSdk } from "calimero-sdk";

export default CalimeroSdk.init({
  // @ts-ignore
  shardId: process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID,
  // @ts-ignore
  walletUrl: process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL,
  // @ts-ignore
  calimeroUrl: process.env.NEXT_PUBLIC_CALIMERO_ENDPOINT_URL,
  // @ts-ignore
  calimeroWebSdkService: process.env.NEXT_PUBLIC_CALIMERO_WEB_SDK_SERVICE_URL,
});

/**
 * Shard ID -> find it in your Calimero dashboard
 * walletUrl -> url to wallet -> can be local one at localhost:1234 , or  myNear wallet
 * calimeroUrl -> calimero endpoint for querying -> e.g.  url.../neard-rpc
 * calimeroWebSdkService ->  url of the calimero dashboard
 */
