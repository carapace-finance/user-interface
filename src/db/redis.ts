import { Redis } from "@upstash/redis";

const AVAILABLE_PLAYGROUNDS = "availablePlaygrounds";
const USED_PLAYGROUNDS = "usedPlaygrounds";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export const getAvailablePlaygroundCount = async (): Promise<number> => {
  return await redis.scard(AVAILABLE_PLAYGROUNDS);
};

/**
 * removes & returns the random playground id from the available playgrounds set in redis persistence store
 * @returns playground id in redis store
 */
export const popRandomAvailablePlaygroundId = async (): Promise<string> => {
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
export const addUsedPlaygroundId = async (playgroundIdToUse: string) => {
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
export const retrievePlaygroundDetails = async (playgroundId: string) => {
  return await redis.hgetall(`${AVAILABLE_PLAYGROUNDS}:${playgroundId}`);
};

export const saveAvailablePlaygroundDetails = async (playgroundInfo) => {
  return await redis.hset(
    `${AVAILABLE_PLAYGROUNDS}:${playgroundInfo.forkId}`,
    playgroundInfo
  );
};
