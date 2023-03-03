import useCalimero from "../hooks/useCalimero";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import { useRouter } from "next/router";

let walletConnectionObject: WalletConnection | undefined = undefined;

export default function Dashboard() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, "calimero");
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
    await walletConnectionObject?.requestSignIn({});
  }

  const signOut = async() => {
    await walletConnectionObject?.signOut() 
    setIsSignedIn(false);
  }

  return (
    <PageWrapper
      signIn={signIn}
      isSignedIn={isSignedIn}
      signOut={signOut}
      title={translations.pages.indexPageTitle}
    >
     <div className="w-full text-white flex justify-center items-center mt-32 text-3xl">
        Logged in! Content goes here
     </div>
    </PageWrapper>
  );
}
