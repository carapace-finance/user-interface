import { JsonRpcProvider } from "@ethersproject/providers";
import { PlaygroundInfo } from "@utils/forked/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  addAvailablePlaygroundId,
  removeUsedPlaygroundId,
  retrievePlaygroundDetails
} from "src/db/redis";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { userAddress },
      method
    } = req;

    switch (method) {
      case "DELETE":
      case "POST":
        const playgroundId = req.body;
        console.log("Stopping a playground: ", playgroundId);
        await stopPlayground(playgroundId);
        res.status(200).json({
          success: true
        });
        break;
      default:
        res.setHeader("Allow", ["DELETE", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error("Failed to stop playground", e);
    return res.status(500).json({
      success: false
    });
  }
};

async function stopPlayground(playgroundId: string) {
  // step 1: retrieve the playground details from redis
  let playgroundInfo = await retrievePlaygroundDetails(playgroundId);
  let playgroundInfoString = playgroundInfo as Record<string, string>;

  // step 2: Revert the fork to the snapshot id
  const forkProvider = new JsonRpcProvider(playgroundInfoString.url);
  await forkProvider.send("evm_revert", [playgroundInfoString.snapshotId]);

  // step 3: Remove the playground id from the used playgrounds set
  await removeUsedPlaygroundId(playgroundId);

  // step 5: Add an id of the stopped playground to available playgrounds set
  await addAvailablePlaygroundId(playgroundId);

  console.log("Successfully stopped a playground: ", playgroundInfoString.forkId);
}
