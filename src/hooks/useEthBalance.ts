import { useEffect, useState } from "react";
import { useProvider, useAccount } from "wagmi";
import type { Address } from "abitype";
import { ethers } from "ethers";

export default function useEthBalance(owner?: Address) {
  const { address } = useAccount();
  const provider = useProvider();
  const [res, setRes] = useState("");
  const targetAddress: Address = owner ?? address;

  useEffect(() => {
    const getEthBalance = async () => {
      const res = await provider.getBalance(targetAddress);
      setRes(ethers.utils.formatUnits(res, "ether"));
    };
    if (!!targetAddress) getEthBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetAddress]);

  return res;
}
