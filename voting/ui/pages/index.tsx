import { useRouter } from "next/router";
import useCalimero from "../hooks/useCalimero";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import VotingComponent from "../components/voting/VotingComponent";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import { createVoteContractCall } from "../utils/callMethods";



export default function Dashboard() {
  const { isSignedIn, calimero, walletConnectionObject } = useCalimero();
  const [accountId, setAccountId] = useState<String | null>("");

  useEffect(() => {
    if (isSignedIn && localStorage.getItem("accountId")) {
      setAccountId(localStorage.getItem("accountId"));
    }
  }, [isSignedIn]);

  return (
    <PageWrapper
      title={translations.pages.indexPageTitle}
    >
     <VotingComponent
        contractCall={(option, calimero) => createVoteContractCall(option, calimero)}
        calimero={calimero}
        walletConnectionObject={walletConnectionObject}
      />
    </PageWrapper>
  );
}
