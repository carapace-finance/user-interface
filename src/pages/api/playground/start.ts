import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { deployToFork } from "@utils/forked/tenderly";
import { preparePlayground } from "@utils/forked/playground";
import { Playground } from "@utils/forked/types";

type PlaygroundInfo = {
  forkId: string;
  url: string;
  snapshotId: string;
  poolFactoryAddress: string;
  poolAddress: string;
  poolCycleManagerAddress: string;
};

const MIN_AVAILABLE_PLAYGROUNDS = 2;
const AVAILABLE_PLAYGROUNDS = "availablePlaygrounds";
const USED_PLAYGROUNDS = "usedPlaygrounds";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

/**
 * removes & returns the random playground id from the available playgrounds set in redis persistence store
 * @returns playground id in redis store
 */
const popRandomAvailablePlaygroundId = async (): Promise<string> => {
  return await redis.spop(AVAILABLE_PLAYGROUNDS);
};

/**
 * removes the specified playground id from the used playgrounds set in redis persistence store
 * @returns playground id in redis store
 */
export const removeUsedPlaygroundId = async (playgroundId: string) => {
  return await redis.srem(USED_PLAYGROUNDS, playgroundId);
};

/**
 * Adds playground id to the used playgrounds set in redis persistence store
 * @param playgroundIdToUse playground id in redis store
 */
const addUsedPlaygroundId = async (playgroundIdToUse: string) => {
  return await redis.sadd(USED_PLAYGROUNDS, `${playgroundIdToUse}`);
};

/**
 * Adds playground id to the available playgrounds set in redis persistence store
 * @param playgroundIdToUse playground id in redis store
 */
export const addAvailablePlaygroundId = async (playgroundId: string) => {
  return await redis.sadd(AVAILABLE_PLAYGROUNDS, `${playgroundId}`);
};

/**
 * Retrieve the playground details from redis persistence store
 * @param playgroundId
 * @returns Playground details
 */
export const retrievePlaygroundDetails = async (
  playgroundId: string
): Promise<PlaygroundInfo> => {
  return await redis.hgetall(`${AVAILABLE_PLAYGROUNDS}:${playgroundId}`);
};

const saveAvailablePlaygroundDetails = async (
  playgroundInfo: PlaygroundInfo
) => {
  return await redis.hset(
    `${AVAILABLE_PLAYGROUNDS}:${playgroundInfo.forkId}`,
    playgroundInfo
  );
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { userAddress },
      method
    } = req;

    switch (method) {
      case "GET":
      case "POST":
        let availablePlaygroundCount: number = await redis.scard(
          AVAILABLE_PLAYGROUNDS
        );
        console.log("availablePlaygroundCount: ", availablePlaygroundCount);

        if (availablePlaygroundCount === 0) {
          console.log("we need to create a new playground and wait");
          await startNewPlayground();
        } else if (availablePlaygroundCount - 1 < MIN_AVAILABLE_PLAYGROUNDS) {
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
