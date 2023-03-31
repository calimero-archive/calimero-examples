import MintDialog from "@/components/mintDialog/MintDialog";
import PageWrapper from "@/components/pageWrapper/PageWrapper";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import { config } from "../utils/calimeroSdk";

let walletConnectionObject: WalletConnection | undefined = undefined;

export default function Mint() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>("");

  const login = async () => {
    try {
      await walletConnectionObject?.requestSignIn({
        contractId: config.nftContract,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    walletConnectionObject?.signOut();
    setIsSignedIn(false);
  };

  useEffect(() => {
    if (isSignedIn && localStorage.getItem("accountId")) {
      setAccountId(localStorage.getItem("accountId"));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(
        calimero,
        config.nftContract
      );
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = walletConnectionObject?.account();
      if (account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
    };
    init();
  }, []);

  useEffect(() => {
    const absolute = window.location.href.split("?");
    const url = absolute[0];
    router.replace(url);
  }, []);

  return (
    <PageWrapper
      isSignedIn={isSignedIn}
      title={translations.home.title}
      nearLogin={login}
      nearLogout={() => {
        logout();
        router.reload();
      }}
      nearSignedIn={isSignedIn}
      openMint={true}
    >
      <MintDialog walletConnectionObject={walletConnectionObject} />
    </PageWrapper>
  );
}
