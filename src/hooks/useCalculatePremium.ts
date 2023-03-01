import { useContractRead, useContractReads, useNetwork } from "wagmi";
import useDebounce from "@/hooks/useDebounce";
import { BigNumber } from "@ethersproject/bignumber";
import { getDecimalMul, getDaysInSeconds } from "@/utils/utils";
import type { Address } from "abitype";
import PremiumCalculatorABI from "@/contracts/mainnet/abi/PremiumCalculator.json";
import ProtectionPoolABI from "@/contracts/mainnet/abi/ProtectionPool.json";
import ReferenceLendingPoolsABI from "@/contracts/mainnet/abi/ReferenceLendingPools.json";

const useCalculatePremium = (
  protectionPoolAddress: Address,
  protctionAmount: string,
  protctionDuration: number
) => {
  const { chain } = useNetwork();

  const protenctionPoolContract = {
    address: protectionPoolAddress,
    abi: ProtectionPoolABI,
    chainId: chain?.id
  };
  const referenceLendingPoolsContract = {
    address: "0xE673b1191481AbB2867d754c37706D71DD36A353", // TODO: get from protectionPool
    abi: ReferenceLendingPoolsABI,
    chainId: chain?.id
  };

  const readsFn = useContractReads({
    contracts: [
      {
        ...protenctionPoolContract,
        functionName: "getPoolInfo"
      },
      {
        ...protenctionPoolContract,
        functionName: "calculateLeverageRatio"
      },
      {
        ...protenctionPoolContract,
        functionName: "totalSTokenUnderlying"
      },
      {
        ...referenceLendingPoolsContract,
        functionName: "calculateProtectionBuyerAPR",
        args: ["0xE673b1191481AbB2867d754c37706D71DD36A353"]
      }
    ]
  });

  const amount = getDecimalMul(protctionAmount, 18);
  const args: [number, BigNumber, BigNumber, BigNumber, BigNumber, any] =
    useDebounce([
      getDaysInSeconds(protctionDuration),
      amount,
      readsFn?.data?.[3], //calculateProtectionBuyerAPR
      readsFn?.data?.[1], //calculateLeverageRatio
      readsFn?.data?.[2], //totalSTokenUnderlying
      (readsFn?.data?.[0] as any)?.params
    ]);

  const readFn = useContractRead({
    address: "0x1A3279fC30bAB096BC0c8a21B1a3C896A7680903", // TODO: get this from config
    abi: PremiumCalculatorABI,
    functionName: "calculatePremium",
    args,
    chainId: chain?.id,
    enabled:
      !!chain &&
      !!protectionPoolAddress &&
      BigNumber.from(amount).gt(0) &&
      readsFn.isFetched &&
      readsFn.isSuccess
  });

  return { ...readFn };
};

export default useCalculatePremium;
