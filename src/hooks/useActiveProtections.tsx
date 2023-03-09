import { useContractRead, useNetwork, useAccount } from "wagmi";
import useDebounce from "@/hooks/useDebounce";
import ProtectionPoolABI from "@/contracts/mainnet/abi/ProtectionPool.json";
import { Address } from "abitype";

const useActiveProtections = (poolAddress: Address) => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const readFn = useContractRead({
    address: poolAddress,
    abi: ProtectionPoolABI,
    functionName: "getActiveProtections",
    args: [address],
    chainId: chain?.id,
    enabled: !!chain
  });

  return { ...readFn };
};

export default useActiveProtections;
