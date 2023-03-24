const CONTRACT_NAME = process.env.CONTRACT_NAME || 'nft-contract.kuzmatest2.testnet';

export function getConfig() {
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
      };
}

export interface Config {
  networkId: string,
  nodeUrl: string,
  contractName: string,
  walletUrl: string,
  helperUrl: string
}
