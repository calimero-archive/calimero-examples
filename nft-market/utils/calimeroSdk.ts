export const config = {
  calimeroUrl:
    process.env.NEXT_PUBLIC_CALIMERO_URL ||
    "https://api.calimero.network/api/v1/shards/demos-calimero-testnet/neard-rpc/",
  calimeroToken:
    process.env.NEXT_PUBLIC_CALIMERO_TOKEN ||
    "bf99e84bc001f8e58419d3acb8493369217c9a2317481e1af584269f3b63620c",
  nftContract: "nftcontract.demos.calimero.testnet",
  marketContract: "marketcontract.demos.calimero.testnet",
};
