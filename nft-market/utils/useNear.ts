import { useEffect, useState } from "react";
import {
  WalletConnection,
  keyStores,
  connect,
  ConnectConfig,
} from "near-api-js";
import { useRouter } from "next/router";

export const contractName = "nft-contract.kuzmatest2.testnet";


export default function useNear() {
  const [config, setConfig] = useState<ConnectConfig | undefined>(undefined);
  const [nearSignedIn, setNearSignedIn] = useState(false);
  const [walletConn, setWalletConn] = useState<WalletConnection>();
  const router = useRouter();

  async function login() {
    if (!config) {
      return;
    }

    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, contractName);

    try {
      await wallet.requestSignIn({
        contractId: contractName,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function logout() {
    if (!config) {
      return;
    }
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, contractName);
    try {
      router.push("/");
      await wallet.signOut();
      localStorage.removeItem("nearAccountId");
      localStorage.removeItem("accountId");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const connectionConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      setConfig(connectionConfig);
    }
  }, []);

  useEffect(() => {
    const isSigned = async () => {
      if (config) {
        const nearConnection = await connect(config);
        const wallet = new WalletConnection(nearConnection, contractName);
        setWalletConn(wallet);
        const nearSignedIn = await wallet.isSignedInAsync();
        setNearSignedIn(nearSignedIn);
        if (nearSignedIn) {
          localStorage.setItem("nearAccountId", wallet.getAccountId());
        }
      }
    };
    isSigned();
  }, [config]);
  
  return {
    login,
    logout,
    nearSignedIn,
    walletConn
  };
}
