import { useRouter } from "next/router";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import StartGamePopup from "../components/nh/startGameComponents/StartGamePopup";
import useCalimero from "../hooks/useCalimero";
import { startGameMethod } from "../utils/callMethods";
import translations from "../constants/en.global.json";

export default function StartGamePage() {
  const router = useRouter();
  const { calimero } = useCalimero();

  return (
    <PageWrapper
      title={translations.pages.startGameTitle}
      currentPage={router.pathname}
    >
      <StartGamePopup
        contractCall={(playerB, calimero) => startGameMethod(playerB, calimero)}
        calimero={calimero}
      />
    </PageWrapper>
  );
}
