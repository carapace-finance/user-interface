import { deleteFork } from "@utils/forked/tenderly";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAvailablePlaygroundCount,
  getUsedPlaygrounds,
  deleteAvailablePlaygroundDetails,
  removeUsedPlaygroundId,
  getAvailablePlaygrounds,
  removeAvailablePlaygroundId
} from "src/db/redis";
import { startNewPlayground, StartPlaygroundResult } from "./start";

const TOTAL_PLAYGROUNDS = 20;
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;

    switch (method) {
      case "GET":
      case "POST":
        let availablePlaygroundCount: number =
          await getAvailablePlaygroundCount();
        console.log("availablePlaygroundCount: ", availablePlaygroundCount);

        const playgroundsNeeded =
          TOTAL_PLAYGROUNDS - availablePlaygroundCount;
        console.log("we need to create a new playgrounds: ", playgroundsNeeded);
        if (playgroundsNeeded > 0) {
          for (let i = 0; i < playgroundsNeeded; i++) {
            const currentIndex = i;
            await startNewPlayground()
              .then((result: StartPlaygroundResult) => {
                if (result.success) {
                  console.log(
                    `Successfully started new playground at index: ${currentIndex}, playgroundId: ${result.playgroundId}`
                  );
                } else {
                  console.log(
                    `Failed to start new playground at index: ${currentIndex}, playgroundId: ${result.playgroundId}`
                  );

                  if (result.playgroundId) {
                    console.log("Deleting playground: ", result.playgroundId);
                    deletePlayground(result.playgroundId);
                  }
                }
              })
              .catch((e) => {
                console.log(
                  `Failed to start new playground at index: ${currentIndex}`,
                  e
                );
              });
          }
        }
        res.status(200).json({
          success: true
        });
        break;
      case "DELETE":
        console.log("Cleaning up playgrounds");
        const usedPlaygrounds = await getUsedPlaygrounds();
        const availablePlaygrounds = await getAvailablePlaygrounds();

        usedPlaygrounds.concat(availablePlaygrounds).forEach(deletePlayground);

        res.status(200).json({
          success: true
        });
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error("Failed to setup playground", e);
    return res.status(500).json({
      success: false
    });
  }
};

const deletePlayground = async (playgroundId: string): Promise<void> => {
  deleteAvailablePlaygroundDetails(playgroundId);
  removeUsedPlaygroundId(playgroundId);
  removeAvailablePlaygroundId(playgroundId);
  deleteFork(playgroundId, process.env.TENDERLY_ACCESS_KEY);
};
