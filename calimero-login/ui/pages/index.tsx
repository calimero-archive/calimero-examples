import useCalimero from "../hooks/useCalimero";
import { useEffect, useState } from "react";
import translations from "../constants/en.global.json";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";



export default function Dashboard() {
  const { isSignedIn } = useCalimero();
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
     <div className="w-full text-white flex justify-center items-center mt-32 text-3xl">
        Logged in! Content goes here
     </div>
    </PageWrapper>
  );
}
