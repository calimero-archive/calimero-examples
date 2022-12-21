import { useRouter } from "next/router";
import CurrentGames from "../components/nh/currentGamesPage/CurrentGames";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";

export default function CurrentGamesPage() {
  const router = useRouter();

  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <CurrentGames />
    </PageWrapper>
  );
}
