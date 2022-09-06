import { Contract } from "near-api-js";
import {
  connectToShard,
  contractAddress,
  ContractCallProps,
  MAX_GAS,
} from "../../../utils/contractUtils";

export default async function handler(req, res) {
  const { playerA, playerB } = req.body;
  try {
    const result = await startGameMethod({
      playerA,
      playerB,
    });
    console.log(result);
    res.status(200).json({
      success: true,
      game_id: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function startGameMethod(props: ContractCallProps) {
  const data = await connectToShard(props.playerA);
  const contract = new Contract(data.account, contractAddress, {
    changeMethods: ["start_game"],
    viewMethods: [],
  });
  // @ts-expect-error: propery doesent exist
  const res = await contract.start_game(
    {
      player_a: props.playerA,
      player_b: props.playerB,
    },
    MAX_GAS,
    0
  );
  return res;
}
