import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export const SECONDS_PER_DAY = 86400;

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

export const unixtimeDiffFromNow = (expireDate: number) =>
  // https://day.js.org/docs/en/display/from-now
  dayjs.unix(expireDate).fromNow(true);

export const readableDate = (date: string) =>
  dayjs(date).format("MMMM d, YYYY h:mma");

export const secondsToDays = (seconds: number): number =>
  seconds / SECONDS_PER_DAY;

export const getCurrentCycleEnd = (start: string, duration: string): string => {
  const endTime: number = Number(start) + Number(duration);
  return getRelativeDays(endTime);
};

export const getNextCycleEnd = (start: string, duration: string): string => {
  const endTime: number = Number(start) + Number(duration);
  return unixtimeDiffFromNow(endTime);
};

export const getRelativeDays = (time: number): string =>
  dayjs().add(1, "d").isSameOrAfter(dayjs.unix(time))
    ? unixtimeDiffFromNow(time)
    : `${dayjs.unix(time).diff(dayjs(), "day")} Days`;
