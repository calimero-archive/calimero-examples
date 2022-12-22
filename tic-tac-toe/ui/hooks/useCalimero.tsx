import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { useEffect, useState } from "react";
import calimeroSdk from "../utils/calimeroSdk";
import walletConnection from "../utils/walletConnection";

import { Buffer } from "buffer";

export default function useCalimero() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calimero, setCalimero] = useState<CalimeroSdk>();
  const [walletConnectionObject, setWalletConnectionObject] =
    useState<WalletConnection>();

  useEffect(() => {
    const initialiseWalletConnection = async () => {
      if (walletConnectionObject) {
        setIsSignedIn(walletConnectionObject.isSignedIn());
      }
    };
    initialiseWalletConnection();
  }, [walletConnectionObject]);

  useEffect(() => {
    const initialiseCalimero = async () => {
      window.Buffer = window.Buffer || Buffer;
      setCalimero(calimeroSdk);
      const wallet = await walletConnection();
      setWalletConnectionObject(wallet);
    };
    if (!calimero || !walletConnectionObject) {
      initialiseCalimero();
    }
  }, [calimero, walletConnectionObject]);
  return { isSignedIn, calimero, walletConnectionObject };
}
