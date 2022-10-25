import { CalimeroSdk } from "calimero-sdk";

const shardId = process.env.NEXT_PUBLIC_CALIMERO_SHARD_ID;
const walletUrl = process.env.NEXT_PUBLIC_WALLET_ENDPOINT_URL;
const calimeroUrl = process.env.NEXT_PUBLIC_CALIMERO_ENDPOINT_URL;
const calimeroWebSdkService =
  process.env.NEXT_PUBLIC_CALIMERO_WEB_SDK_SERVICE_URL;

interface CalimeroConfig {
  shardId: string;
  walletUrl: string;
  calimeroWebSdkService: string;
  calimeroUrl: string;
}
function getConfig() {
  let config: CalimeroConfig;
  if (shardId && walletUrl && calimeroUrl && calimeroWebSdkService) {
    config = {
      shardId: shardId,
      walletUrl: walletUrl,
      calimeroUrl: calimeroUrl,
      calimeroWebSdkService: calimeroWebSdkService,
    };
    return config;
  } else {
    return {
      shardId: "",
      walletUrl: "",
      calimeroUrl: "",
      calimeroWebSdkService: "",
    };
  }
}

export default CalimeroSdk.init(getConfig());
