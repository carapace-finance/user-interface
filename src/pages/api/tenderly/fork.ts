import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { deployToFork } from "@utils/forked/tenderly";
import { JsonRpcProvider } from "@ethersproject/providers";
import { deployedContracts } from "@type/types";

type Fork = {
  forkId: string;
  url: string;
  snapshotId: string;
  provider: JsonRpcProvider;
  deployedContracts: deployedContracts;
};

const MAX_FORKS = 2; //todo: increase this number later
const AVAILABLE_FORKS = "availableForks";
const USED_FORKS = "usedForks";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function forkHandler(
  req: NextApiRequest,
  res: NextApiResponse<Fork>
) {
  const {
    query: { userAddress },
    method
  } = req;

  switch (method) {
    case "GET":
      let availableForkCount: number = await redis.scard(AVAILABLE_FORKS);
      console.log("availableForkCount ==>", availableForkCount);
      const necessaryForkCount = MAX_FORKS - availableForkCount;
      console.log("necessaryForkCount ==>", necessaryForkCount);
      if (necessaryForkCount === 0) {
        console.log("we have enough forks available");
      } else {
        for (let i = 0; i < necessaryForkCount; i++) {
          await createAndAddFork();
          let forkIdToUse: string;
          if (i === 0) {
            forkIdToUse = await redis.spop(AVAILABLE_FORKS);
            console.log("forkIdToUse ==>", forkIdToUse);
            await redis.sadd(USED_FORKS, `${forkIdToUse}`);
          }
          // todo: need the logic to figure out which fork is in use instead of putting all the created forks in use
          // todo: this is the case not only in the initial creation but also when two forks need to be added when two users simultaneously use two forks
          res.status(200);
        }
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// todo: what happens if two users call this function simultaneously?
// todo: I thought about making a build script to make ten forks initially but I think we can create ten forks the first time this function is called.
async function createAndAddFork() {
  try {
    const playground = await deployToFork(process.env.TENDERLY_ACCESS_KEY);
    // todo: initializePlayground as well
    console.log("Successfully created a fork: ", playground.forkId);
    await redis.hset(`${AVAILABLE_FORKS}:${playground.forkId}`, {
      forkId: playground.forkId,
      url: `https://rpc.tenderly.co/fork/${playground.forkId}`,
      snapshotId: "0x123", // todo: what should be the snapshotId?
      provider: playground.provider,
      deployedContracts: playground.deployedContracts
    });

    //Store the id of the fork to retrieve it later
    await redis.sadd(AVAILABLE_FORKS, `${playground.forkId}`);
    console.log("Successfully added a fork to redis");
    return playground.forkId;
  } catch (e) {
    console.error("Failed to retrieve data from redis", e);
  }
}
