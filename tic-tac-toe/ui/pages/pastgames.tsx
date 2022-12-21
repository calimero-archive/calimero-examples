import { useRouter } from "next/router";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import PastGames from "../components/nh/pastGamesPage/PastGames";

export default function PageGamesPage() {
  const router = useRouter();

  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <PastGames />
    </PageWrapper>
  );
}
