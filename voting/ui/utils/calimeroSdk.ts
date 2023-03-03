export const config = {
  shardId: process.env.NEXT_PUBLIC_SHARD_ID || "calimero-testnet",
  walletUrl: process.env.NEXT_PUBLIC_WALLET_URL || "https://testnet.mynearwallet.com" ,
  calimeroUrl: process.env.NEXT_PUBLIC_CALIMERO_URL || "https://api.calimero.network",
  calimeroWebSdkService: process.env.NEXT_PUBLIC_CALIMERO_WS || "https://app.calimero.network",
  calimeroToken: process.env.NEXT_PUBLIC_CALIMERO_TOKEN || ""
};
