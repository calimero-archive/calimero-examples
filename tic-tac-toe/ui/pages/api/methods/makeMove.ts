import { Contract } from "near-api-js";
import {
  connectToShard,
  contractAddress,
  MAX_GAS,
} from "../../../utils/contractUtils";

export default async function handler(req, res) {
  const { player, field, gameId } = req.body;

  try {
    const result = await makeAMoveMethod({
      player,
      field,
      gameId,
    });
    res.status(200).json({
      success: true,
      response: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}
export interface ContractCallProps {
  player: string;
  field: string;
  gameId: string;
}

export async function makeAMoveMethod(props: ContractCallProps) {
  const data = await connectToShard(props.player);

  const contract = new Contract(data.account, contractAddress, {
    changeMethods: ["make_a_move"],
    viewMethods: [],
  });

  const res = await contract["make_a_move"](
    {
      game_id: parseInt(props.gameId),
      selected_field: parseInt(props.field),
    },
    MAX_GAS,
    0
  );
  return res;
}
