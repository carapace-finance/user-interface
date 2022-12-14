import { addMinAvailablePlaygrounds } from "../db/redis";

(async () => {
  await addMinAvailablePlaygrounds(2);
})().catch((err) => {
  console.error(err);
});
