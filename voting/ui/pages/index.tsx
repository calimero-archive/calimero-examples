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
  const [error, setError] = useState("");
  const router = useRouter();
  
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
    localStorage.clear();
    walletConnectionObject?.signOut()
    setIsSignedIn(false);
  }

  const callVote = async (option: string, walletConnectionObject: WalletConnection | undefined) => {
    const response = await createVoteContractCall(option, walletConnectionObject);
    try {
      if(response?.error){
        const voteError = JSON.parse(response?.error.toString().split("Error: ")[1]).kind.ExecutionError;
        setError(voteError);
      }
    } catch (error) {
      setError("Something went wrong calling smart contract!");
    }
  }

  return (
    <PageWrapper 
      signIn={signIn}
      isSignedIn={isSignedIn}
      signOut={signOut}
      title={translations.pages.indexPageTitle}
    >
      <VotingComponent
        error={error}
        contractCall={(option, walletConnectionObject) => callVote(option, walletConnectionObject)}
        walletConnectionObject={walletConnectionObject}
      />
    </PageWrapper>
  );
}
