import * as nearAPI from "near-api-js";
import * as big from "bn.js";
import { CalimeroSdk, WalletConnection } from "calimero-sdk";
import { Poll } from "../components/voting/VotingComponent";

export const createVoteContractCall = async (option: string, calimero: CalimeroSdk | undefined) => {
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
      option: option
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
        receiverId: "vote.lal89.calimero.testnet",
        actions: [
          nearAPI.transactions.functionCall(
            "vote",
            Buffer.from(JSON.stringify(contractArgs)),
            new big.BN("300000000000000"),
            new big.BN("0")
          ),
        ],
        walletMeta: meta,
      });
    } catch (error) {
      console.log(error);
    }
};


export async function setPollOptions(
    setPollData: (pollData: Poll) => void,
    walletConnectionObject: WalletConnection | undefined
  ) {
    if (walletConnectionObject) {
      const account = walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        "vote.lal89.calimero.testnet",
        { viewMethods: ["get_poll"], changeMethods: [] }
      );
      // @ts-expect-error: get_results does not exist on type contract
      const results = await contract['get_poll']();
      // this returns object
      /*
        {
          question: 'how can i deploy this?',
          options: [ 'dunno', 'google it' ]
        }
      */
     setPollData(results);
    }
};

interface Option {
  option: string;
  count: number;
}

function parseContractResult(result: { [key: string]: number }): Option[] {
  return Object.entries(result).map(([option, count]) => ({ option, count }));
}

export async function getVoteResults(
    setOptions: (options: Option[]) => void,
    walletConnectionObject: WalletConnection | undefined
  ) {
    if (walletConnectionObject) {
      const account = walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        "voting.fran.lal89.calimero.testnet",
        { viewMethods: ["get_results"], changeMethods: [] }
      );
      /**
       * returns 
       * { 'google it': 1, dunno: 2 }
       */
      // @ts-expect-error: get_results does not exist on type contract

      const results = await contract['get_results']();
      const parsedResults = parseContractResult(results);

    }
};
