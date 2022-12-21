import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoginComponent from "../components/dashboard/LoginComponent";
import OpenGamesList from "../components/dashboard/OpenGameList";
import MenuNavigation from "../components/Navigation";
import CalimeroLogo from "../components/nh/images/CalimeroLogo";
import TictactoeLogo from "../components/nh/images/TictactoeLogo";
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
