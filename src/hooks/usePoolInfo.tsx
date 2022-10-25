import { useState, useEffect } from "react";

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

  return {};
};

export default usePoolInfo;
