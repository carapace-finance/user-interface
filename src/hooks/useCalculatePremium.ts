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
  lendingPoolAddress: Address,
  protctionAmount: string,
  protctionDuration: number
) => {
  const { chain } = useNetwork();

  const protenctionPoolContract = {
    address: protectionPoolAddress,
    abi: ProtectionPoolABI,
    chainId: chain?.id
  };

  const protectionPoolReadsFn = useContractReads({
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
        functionName: "getPoolDetails"
      }
    ]
  });

  // const referenceLendingPoolsFn = useContractRead({
  //   address: (protectionPoolReadsFn?.data?.[0] as any)?.referenceLendingPools,
  //   abi: ReferenceLendingPoolsABI,
  //   functionName: "getLendingPools",
  //   chainId: chain?.id,
  //   enabled:
  //     !!chain &&
  //     !!(protectionPoolReadsFn?.data?.[0] as any)?.referenceLendingPools
  // });

  const aprFn = useContractRead({
    address: (protectionPoolReadsFn?.data?.[0] as any)?.referenceLendingPools,
    abi: ReferenceLendingPoolsABI,
    functionName: "calculateProtectionBuyerAPR",
    chainId: chain?.id,
    args: [lendingPoolAddress],
    enabled:
      !!chain &&
      !!(protectionPoolReadsFn?.data?.[0] as any)?.referenceLendingPools
  });

  const amount = getDecimalMul(protctionAmount, 18);
  const args: [number, BigNumber, BigNumber, BigNumber, BigNumber, any] =
    useDebounce([
      getDaysInSeconds(protctionDuration),
      amount,
      aprFn.data, //calculateProtectionBuyerAPR
      protectionPoolReadsFn?.data?.[1], //calculateLeverageRatio
      protectionPoolReadsFn?.data?.[2]?.[0], //totalSTokenUnderlying
      (protectionPoolReadsFn?.data?.[0] as any)?.params
    ]);

  // console.log("args:", args);

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
      protectionPoolReadsFn.isFetched &&
      protectionPoolReadsFn.isSuccess
  });

  return { ...readFn };
};

export default useCalculatePremium;
