import { useRouter } from "next/router";
import { useState } from "react";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import StartGamePopup from "../components/nh/startGameComponents/StartGamePopup";

export default function Dashboard() {
  const router = useRouter();
  const [logged, setLogged] = useState<boolean>(true);
  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <StartGamePopup />
    </PageWrapper>
  );
}
