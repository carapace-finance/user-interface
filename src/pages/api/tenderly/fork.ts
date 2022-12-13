import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { createFork } from "../../../utils/forked/tenderly";

type Fork = {
  id: string;
  url: string;
  snapshotId: string;
};

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
      if (availableForkCount === 0) {
        await createAndAddFork();
      }
      let availableForkKey: string = await redis.spop(AVAILABLE_FORKS);
      const availableFork: Fork = await redis.hgetall(availableForkKey);
      await redis.sadd(USED_FORKS, `${USED_FORKS}:${availableFork.id}`);
      res.status(200).json(availableFork);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

let counter = 1;
async function createAndAddFork(): Promise<string> {
  try {
    console.log("Redis URL: ", process.env.UPSTASH_REDIS_REST_URL);
    console.log(process.env.TENDERLY_API_KEY);
    const id = await createFork(process.env.TENDERLY_API_KEY);
    console.log("Successfully created fork: ", id);

    await redis.hset(`${AVAILABLE_FORKS}:${id}`, {
      id: id,
      url: `https://rpc.tenderly.co/fork/${id}`,
      snapshotId: "0x123"
    });

    const availableForkKey = `${AVAILABLE_FORKS}:${id}`;
    //Store the id of the fork to retrieve it later
    await redis.sadd(AVAILABLE_FORKS, availableForkKey);
    console.log("Successfully added a fork to redis");
    return availableForkKey;
  } catch (e) {
    console.error("Failed to retrieve data from redis", e);
  }
}
