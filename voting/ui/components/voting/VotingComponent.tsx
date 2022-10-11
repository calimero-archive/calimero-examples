import { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { useRouter } from "next/router";
import { createNewVote } from "../../utils/callMethods";
const { Contract } = nearAPI;

export const config = {
  networkId: "k-calimero-testnet",
  nodeUrl: "",
  headers: {
    "x-api-key": "",
  },
};

export async function getPoll() {
  const near = await nearAPI.connect(config);
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const account = await near.account(localStorage.getItem("account_id"));
  const contract = new Contract(account, "voting.k.calimero.testnet", {
    viewMethods: ["get_poll"],
    changeMethods: [],
  });
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  let poll = await contract["get_poll"]();
  return poll;
}

export async function getResults() {
  const near = await nearAPI.connect(config);
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  const account = await near.account(localStorage.getItem("account_id"));
  const contract = new Contract(account, "voting.k.calimero.testnet", {
    viewMethods: ["get_results"],
    changeMethods: [],
  });
  // @ts-expect-error: Argument of type 'string | null' is not assignable to parameter of type 'SetStateAction<string>'.
  let results = await contract["get_results"]();
  return results;
}

interface Poll {
  question: string;
  options: string[];
}
interface Vote {
  option: string;
  count: number;
}

export default function VotingComponent() {
  const [poll, setPoll] = useState<Poll>();
  const [votes, setVotes] = useState<Vote[] | undefined>();
  useEffect(() => {
    const getPollData = async () => {
      let polltmp = await getPoll();
      setPoll(polltmp);
    };

    getPollData();
  }, []);

  async function getVotesData() {
    let votestmp = await getResults();
    if (votestmp && poll) {
      let data = [];
      for (let i = 0; i < poll.options.length; i++) {
        let option = poll.options[i];
        let votesCount = votestmp[poll.options[i]];
        data.push({
          option: option,
          count: parseInt(votesCount),
        });
      }
      console.log(data);
      setVotes(data);
    }
  }
  if (!votes) {
    getVotesData();
  }

  return (
    <div className="w-full px-10 py-10 flex justify-center">
      <div className="w-10/12 bg-black rounded-md px-4 py-4 text-white">
        <p>
          Poll question: <span className="font-black">{poll?.question}</span>{" "}
        </p>
        <p className="pt-4 pb-4">Poll options:</p>
        <div className="grid grid-cols-3 w-full gap-x-4 gap-y-2">
          {poll?.options.map((option, i) => {
            return (
              <button
                key={i}
                className="col-span-1 bg-white text-black rounded-md px-6 py-2 text-center cursor-pointer hover:bg-violet-700 transition duration-700 hover:text-white"
                onClick={() => {
                  createNewVote(option.toString());
                  getVotesData();
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="pt-4">
          <p className="pt-4 pb-4">Poll results:</p>
          {votes?.map((vote, i) => (
            <p key={i}>
              {vote.option}:
              <span className="font-black pl-2">{vote.count}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
