import type { NextApiRequest, NextApiResponse } from "next";
import { deployToFork } from "@utils/forked/tenderly";
import { preparePlayground } from "@utils/forked/playground";
import { Playground } from "@utils/forked/types";
import {
  addAvailablePlaygroundId,
  addUsedPlaygroundId,
  getAvailablePlaygroundCount,
  getMinAvailablePlaygrounds,
  popRandomAvailablePlaygroundId,
  retrievePlaygroundDetails,
  saveAvailablePlaygroundDetails,
  setMinAvailablePlaygrounds
} from "src/db/redis";

const MIN_AVAILABLE_PLAYGROUNDS = 5;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { userAddress, ping },
      method
    } = req;

    switch (method) {
      case "GET":
      case "POST":
        if (ping) {
          return res.status(204).end();
        }
        let availablePlaygroundCount: number =
          await getAvailablePlaygroundCount();
        console.log("availablePlaygroundCount: ", availablePlaygroundCount);
        let minAvailablePlaygrounds: number =
          await getMinAvailablePlaygrounds();
        if (!minAvailablePlaygrounds) {
          // set the default value, if not already set in redis persistence store
          minAvailablePlaygrounds = MIN_AVAILABLE_PLAYGROUNDS;
          setMinAvailablePlaygrounds(MIN_AVAILABLE_PLAYGROUNDS);
        }
        console.log("minAvailablePlaygrounds: ", minAvailablePlaygrounds);

        if (availablePlaygroundCount === 0) {
          console.log("we need to create a new playground and wait");
          await startNewPlayground();
        } else if (availablePlaygroundCount - 1 < minAvailablePlaygrounds) {
          console.log("we need to create a new playground without waiting");
          startNewPlayground();
        } else {
          console.log("we have enough playgrounds available");
        }

        // step 1: Pop a random playground id from the available playgrounds set
        let playgroundIdToUse: string = await popRandomAvailablePlaygroundId();

        // step 2: Retrieve the playground details from redis
        const playgroundInfo = await retrievePlaygroundDetails(
          playgroundIdToUse
        );

        // step 3: Add the playground id to the used playgrounds set
        await addUsedPlaygroundId(playgroundIdToUse);

        res.status(200).json({
          success: true,
          playground: playgroundInfo
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

async function startNewPlayground() {
  // step 1: create and deploy smart contracts to a fork
  const playground: Playground = await deployToFork(
    process.env.TENDERLY_ACCESS_KEY
  );

  // step 2: prepare the playground with required initial state changes
  await preparePlayground(playground);

  // step 3: Take a snapshot of the fork to be able to revert user actions later when the playground is stopped
  const snapshotId = await playground.provider.send("evm_snapshot", []);

  // step 4: add a new playground to available playgrounds in redis store
  await saveAvailablePlaygroundDetails({
    forkId: playground.forkId,
    url: `https://rpc.tenderly.co/fork/${playground.forkId}`,
    snapshotId: snapshotId,
    poolFactoryAddress:
      playground.deployedContracts.poolFactoryInstance.address,
    poolAddress: playground.deployedContracts.poolInstance.address,
    poolCycleManagerAddress:
      playground.deployedContracts.poolCycleManagerInstance.address
  });

  // step 5: store the id of the new playground to retrieve it later
  await addAvailablePlaygroundId(playground.forkId);

  console.log("Successfully started a playground: ", playground.forkId);
}
