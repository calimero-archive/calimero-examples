import { useRouter } from "next/router";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import StartGamePopup from "../components/nh/startGameComponents/StartGamePopup";
import { startGameMethod } from "../utils/callMethods";
import translations from "../constants/en.global.json";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import { useEffect, useState } from "react";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;

export default function StartGamePage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, contractName);
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      const account = await walletConnectionObject?.account();
      if(account && signedIn) {
        localStorage.setItem("accountId", account.accountId);
      }
      setIsSignedIn(signedIn);
    }
    init()
  }, []);

  useEffect(()=>{
    const absolute = window.location.href.split("/")
    const url = absolute[0] + "//" + absolute[2];
    router.replace(url)
  },[isSignedIn])

  const signIn = async() => {
    await walletConnectionObject?.requestSignIn({contractId: contractName, methodNames: ["vote"]});
  }

  const signOut = async() => {
    await walletConnectionObject?.signOut() 
    setIsSignedIn(false);
  }

  const functionCall = async(playerB: string)  => {
    await startGameMethod(playerB,walletConnectionObject);
    router.push("/");
  }

  return (
    <PageWrapper 
      signIn={signIn}
      isSignedIn={isSignedIn}
      signOut={signOut}
      title={translations.pages.indexPageTitle}
      currentPage={router.pathname}
    >
      <StartGamePopup
        contractCall={(playerB) => functionCall(playerB)}
      />
    </PageWrapper>
  );
}
