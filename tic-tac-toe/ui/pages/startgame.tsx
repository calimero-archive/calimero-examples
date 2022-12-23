import { useRouter } from "next/router";
import { useState } from "react";
import PageWrapper from "../components/nh/pageWrapper/PageWrapper";
import StartGamePopup from "../components/nh/startGameComponents/StartGamePopup";
import useCalimero from "../hooks/useCalimero";
import * as nearAPI from "near-api-js";

export default function StartGamePage() {
  const router = useRouter();
  const [logged, setLogged] = useState<boolean>(true);
  const { calimero } = useCalimero();

  const contractCall = async (playerB: string) => {
    const accountId = localStorage.getItem("accountId");
    const publicKey = localStorage.getItem("publicKey");
    //@ts-ignore
    const calimeroConnection = await calimero.connect();
    const walletConnection = new nearAPI.WalletConnection(
      calimeroConnection.connection,
      ""
    );
    //@ts-ignore
    walletConnection._authData = { accountId, allKeys: [publicKey] };

    //@ts-ignore
    const account = walletConnection.account(accountId);

    const contractArgs = {
      player_a: accountId,
      player_b: playerB,
    };

    const metaJson = {
      //@ts-ignore
      calimeroRPCEndpoint: calimeroConnection.config.nodeUrl,
      //@ts-ignore
      calimeroShardId: calimeroConnection.config.networkId,
      calimeroAuthToken: localStorage.getItem("calimeroToken"),
    };
    const meta = JSON.stringify(metaJson);

    try {
      //@ts-ignoreS
      await account.signAndSendTransaction({
        receiverId: "tictactoe.fran.calimero.testnet",
        actions: [
          nearAPI.transactions.functionCall(
            "start_game",
            Buffer.from(JSON.stringify(contractArgs)),
            10000000000000,
            "0"
          ),
        ],
        walletMeta: meta,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageWrapper title={"PropUrl"} currentPage={router.pathname}>
      <StartGamePopup contractCall={(playerB) => contractCall(playerB)} />
    </PageWrapper>
  );
}
