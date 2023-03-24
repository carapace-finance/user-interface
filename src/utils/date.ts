import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const SECONDS_PER_DAY = 86400;

dayjs.extend(relativeTime);

export const unixtimeDiffFromNow = (expireDate: number) =>
  // https://day.js.org/docs/en/display/from-now
  dayjs.unix(expireDate).fromNow(true);

export const readableDate = (date: string) =>
  dayjs(date).format("MMMM d, YYYY h:mma");

export const secondsToDays = (seconds: number): number =>
  seconds / SECONDS_PER_DAY;

export const getCurrentCycleEnds = (
  start: string,
  duration: string
): string => {
  const endTime: number = Number(start) + Number(duration);
  return unixtimeDiffFromNow(endTime);
};
