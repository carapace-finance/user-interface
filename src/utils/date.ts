import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const unixtimeDiffFromNow = (expireDate: number) =>
  // https://day.js.org/docs/en/display/from-now
  dayjs.unix(expireDate).fromNow(true);

export const readableDate = (date: string) =>
  dayjs(date).format("MMMM d, YYYY h:mma");
