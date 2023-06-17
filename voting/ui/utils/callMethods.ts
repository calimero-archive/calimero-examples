import * as nearAPI from "near-api-js";
import { WalletConnection } from "calimero-sdk";
import { Poll } from "../components/voting/VotingComponent";
import { Contract } from "near-api-js";

const contractName = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export const createVoteContractCall = async (option: string, walletConnectionObject: WalletConnection | undefined) => {
    const account = walletConnectionObject?.account();
    try {
      if (account){
      const contract = new Contract(account,
        contractName,
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
    } catch (error: unknown) {
      console.error(error);
      return { error: error };
    }
};

export async function setPollOptions(
    setPollData: (pollData: Poll) => void,
    walletConnectionObject: WalletConnection | undefined
  ) {
    try {
       if (walletConnectionObject) {
      const account = walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        contractName,
        { viewMethods: ["get_poll"], changeMethods: [] }
      );
      // @ts-expect-error: get_results does not exist on type contract
      const results = await contract['get_poll']();
      setPollData(results);
    }
    } catch (error: unknown) {
      console.error(error);
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
    try {
       if (walletConnectionObject) {
      const account = walletConnectionObject.account();
      const contract = new nearAPI.Contract(
        account,
        contractName,
        { viewMethods: ["get_results"], changeMethods: [] }
      );
      // @ts-expect-error: get_results does not exist on type contract
      const results = await contract['get_results']();
      const parsedResults = parseContractResult(results);
      setOptions(parsedResults);
    }
    } catch (error: unknown) {
      console.error(error);
    }
};
