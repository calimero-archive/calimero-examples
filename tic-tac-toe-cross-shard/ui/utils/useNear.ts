import React, { useEffect, useState } from "react";
import {
  WalletConnection,
  keyStores,
  connect,
  Contract,
  ConnectConfig,
} from "near-api-js";
import { useRouter } from "next/router";

const contractName = process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID || "";
const config = {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
};
export interface RegisterStatus {
  started: boolean;
  loading: boolean;
}

export default function useNear() {
  const [nearSignedIn, setNearSignedIn] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<RegisterStatus>({
    started: false,
    loading: false,
  });
  const router = useRouter();

  async function login() {
    const keystore = new keyStores.BrowserLocalStorageKeyStore()
    config['keyStore'] = keystore
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, contractName);
    try {
      await wallet.requestSignIn({
        contractId: contractName,
        methodNames: ["register_player"],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function logout() {
    const keystore = new keyStores.BrowserLocalStorageKeyStore()
    config['keyStore'] = keystore
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, contractName);
    try {
      wallet.signOut();
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const isSigned = async () => {
        const keystore = new keyStores.BrowserLocalStorageKeyStore()
        config['keyStore'] = keystore
        const nearConnection = await connect(config);
        const wallet = new WalletConnection(nearConnection, contractName);
        const nearSignedIn = await wallet.isSignedInAsync();
        const absolute = window.location.href.split("?");
        const url = absolute[0];
        router.replace(url);
        setNearSignedIn(nearSignedIn);
        if (nearSignedIn) {
          localStorage.setItem("nearAccountId", wallet.getAccountId());
        }  
    };
    isSigned();
  }, []);

  const register = async () => {
    try {
    
        setRegisterStatus({
          started: true,
          loading: true,
        });
        const keystore = new keyStores.BrowserLocalStorageKeyStore()
        config['keyStore'] = keystore
        const nearConnection = await connect(config);
        const wallet = new WalletConnection(nearConnection, contractName);
        const contract = new Contract(wallet.account(), contractName, {
          viewMethods: [],
          changeMethods: ["register_player"],
        });
        await contract["register_player"]({}, "300000000000000");
        setRegisterStatus({
          started: true,
          loading: false,
        });
      
    } catch (error) {
      console.error(error);
    }
  };

  return {
    login,
    logout,
    register,
    registerStatus,
    nearSignedIn,
    setRegisterStatus,
  };
}
