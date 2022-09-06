
module.exports = {
  env: {
    MASTER_ACCOUNT_PRIVATE_KEY: process.env.MASTER_ACCOUNT_PRIVATE_KEY,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    BASE_ENDPOINT: process.env.BASE_ENDPOINT,
    REGISTRAR_ACCOUNT_ID: process.env.REGISTRAR_ACCOUNT_ID,
    REGISTRAR_CONTRACT_ACCOUNT_ID: process.env.REGISTRAR_CONTRACT_ACCOUNT_ID,
    SHARD_ID: process.env.SHARD_ID,
    MASTER_ACCOUNT_ID: process.env.MASTER_ACCOUNT_ID,
    NFT_ACCOUNT_ID: process.env.NFT_ACCOUNT_ID,
    NFT_CONTRACT_ACCOUNT_ID: process.env.NFT_CONTRACT_ACCOUNT_ID
  },
  webpack: ( config ) => {
    config.resolve.fallback = { fs: false };

    config.module.rules.push( {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [ { loader: '@svgr/webpack', options: { icon: true } } ],
    } );

    return config;
  },
};
