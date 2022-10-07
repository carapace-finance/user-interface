import { useState, useEffect } from "react";
import moment from "moment";

const usePoolInfo = (poolAddress: string) => {
  const [inter, setInter] = useState<NodeJS.Timeout>();

  useEffect(() => {
    (async () => {
      updatePool();
      if (!inter) {
        const id = setInterval(async () => {
          updatePool();
        }, 13000); // TODO: Update this to subscribing to block + update only when block is updated
        setInter(id);
      }
    })();
  }, []);

  const updatePool = async () => {};
  const makeTimestampReadable = (expiryInMS: number): string => {
    const expDateString = new Date(+expiryInMS).toString();
    const expDateTimezone = new Date(+expiryInMS)
      .toLocaleTimeString("en-us", { timeZoneName: "short" })
      .split(" ")[2];
    return `${moment(expDateString).format(
      "MMMM d, YYYY h:mma"
    )} ${expDateTimezone}`;
  };

  return {};
};

export default usePoolInfo;
