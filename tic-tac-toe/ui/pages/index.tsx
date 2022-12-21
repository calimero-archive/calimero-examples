import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import calimeroSdk from "../utils/calimeroSdk";

export default function Dashboard() {
  const router = useRouter();
  const [logged, setLogged] = useState<boolean>(false);
  useEffect(() => {
    const loggedIn = calimeroSdk.isSignedIn();
    if (loggedIn) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  });
  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <div>abc</div>
    </PageWrapper>
  );
}
