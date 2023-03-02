import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { useEffect, useState } from "react";
import { config } from "../utils/calimeroSdk";

let walletConnectionObject: WalletConnection | undefined = undefined;

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export default function useCalimero() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      console.log(calimero);
      await walletConnectionObject.isSignedInAsync();
      setIsSignedIn(walletConnectionObject.isSignedIn());
    }
    init()
  }, []);

  return { isSignedIn, walletConnectionObject };
}