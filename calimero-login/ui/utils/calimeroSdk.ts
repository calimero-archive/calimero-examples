import { CalimeroSdk } from "calimero-sdk";

const shardId = process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID;
const walletUrl = process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL;
const calimeroUrl = process.env.NEXT_PUBLIC_CALIMERO_ENDPOINT_URL;
const calimeroWebSdkService =
  process.env.NEXT_PUBLIC_CALIMERO_WEB_SDK_SERVICE_URL;

function getConfig() {
  if (shardId && walletUrl && calimeroUrl && calimeroWebSdkService) {
    return {
      shardId: shardId,
      walletUrl: walletUrl,
      calimeroUrl: calimeroUrl,
      calimeroWebSdkService: calimeroWebSdkService,
    };
  } else {
    throw new Error("Please fill your configuration!");
  }
}

export default CalimeroSdk.init(getConfig());
