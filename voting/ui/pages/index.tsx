import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import VotingComponent from "../components/voting/VotingComponent";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import { createVoteContractCall } from "../utils/callMethods";

import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { config } from "../utils/calimeroSdk";
import { useRouter } from "next/router";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
let walletConnectionObject: WalletConnection | undefined = undefined;

export default function Dashboard() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const init = async () => {
      //@ts-expect-error config cannot be this
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

  return (
    <PageWrapper 
      signIn={signIn}
      isSignedIn={isSignedIn}
      signOut={signOut}
      title={translations.pages.indexPageTitle}
    >
      <VotingComponent
        contractCall={(option, walletConnectionObject) => createVoteContractCall(option, walletConnectionObject)}
        walletConnectionObject={walletConnectionObject}
      />
    </PageWrapper>
  );
}
