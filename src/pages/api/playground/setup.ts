import type { NextApiRequest, NextApiResponse } from "next";
import { deployToFork } from "@utils/forked/tenderly";
import { preparePlayground } from "@utils/forked/playground";
import { Playground } from "@utils/forked/types";
import {
  getAvailablePlaygroundCount,
  getUsedPlaygrounds,
  deleteAvailablePlaygroundDetails,
  removeUsedPlaygroundId
} from "src/db/redis";
import { startNewPlayground } from "./start";

const TOTAL_AVAILABLE_PLAYGROUNDS = 10;
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
          TOTAL_AVAILABLE_PLAYGROUNDS - availablePlaygroundCount;
        console.log("we need to create a new playgrounds: ", playgroundsNeeded);
        if (playgroundsNeeded > 0) {
          for (let i = 0; i < playgroundsNeeded; i++) {
            await startNewPlayground();
          }
        }
        res.status(200).json({
          success: true
        });
        break;
      case "DELETE":
        console.log("Cleaning up playgrounds");
        const usedPlaygrounds = await getUsedPlaygrounds();
        usedPlaygrounds.forEach(async (playgroundId) => {
          deleteAvailablePlaygroundDetails(playgroundId);
          removeUsedPlaygroundId(playgroundId);
        });
        res.status(200).json({
          success: true
        });
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error("Failed to start playground", e);
    return res.status(500).json({
      success: false
    });
  }
};
