import { Contract } from "near-api-js";
import { connectToShard, contractAddress } from "../../../utils/contractUtils";

export default async function handler(req, res) {
  const { player, gameId } = req.body;
  try {
    const result = await getGameMethod({
      player,
      gameId,
    });
    res.status(200).json({
      success: true,
      board: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}
interface ContractCallProps {
  player: string;
  gameId: string;
}

export async function getGameMethod(props: ContractCallProps) {
  const data = await connectToShard(props.player);

  const contract = new Contract(data.account, contractAddress, {
    changeMethods: [],
    viewMethods: ["get_game"],
  });
  // @ts-expect-error: propery doesent exist
  const response = await contract.get_game({
    game_id: parseInt(props.gameId),
  });
  return response;
}
