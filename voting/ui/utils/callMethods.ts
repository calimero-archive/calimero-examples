import * as nearAPI from "near-api-js";
import { WalletConnection } from "calimero-sdk";
import { Poll } from "../components/voting/VotingComponent";
import { Contract } from "near-api-js";

export const createVoteContractCall = async (option: string, walletConnectionObject: WalletConnection | undefined) => {
    const account = walletConnectionObject?.account();
    if (account){
      const contract = new Contract(account,
        "voting.my-awesome-shard.calimero.testnet",
        {
          viewMethods: [],
          changeMethods: ["vote"],
        });
      // @ts-expect-error: get_results does not exist on type contract
      await contract['vote'](
      {
        option: option,
      },
      "300000000000000",
    );
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
        "voting.my-awesome-shard.calimero.testnet",
        { viewMethods: ["get_poll"], changeMethods: [] }
      );
      // @ts-expect-error: get_results does not exist on type contract
      const results = await contract['get_poll']();
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
        "voting.my-awesome-shard.calimero.testnet",
        { viewMethods: ["get_results"], changeMethods: [] }
      );
      // @ts-expect-error: get_results does not exist on type contract
      const results = await contract['get_results']();
      const parsedResults = parseContractResult(results);
      setOptions(parsedResults);
    }
};
