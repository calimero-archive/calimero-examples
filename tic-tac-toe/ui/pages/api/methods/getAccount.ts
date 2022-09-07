import { Contract } from "near-api-js";
import { connectToShard, contractAddress } from "../../../utils/contractUtils";

export default async function handler(req, res) {
  const { user } = req.body;
  try {
    const result = await getGameMethod({
      user,
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
  user: string;
}

export async function getGameMethod(props: ContractCallProps) {
  const data = await connectToShard(props.user);
}
