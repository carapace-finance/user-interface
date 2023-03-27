import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
  useNetwork
} from "wagmi";
import useDebounce from "@/hooks/useDebounce";
import useTransaction from "@/hooks/useTransaction";
import { BigNumber } from "@ethersproject/bignumber";
import type { Address } from "abitype";
import ProtectionPoolABI from "@/contracts/mainnet/abi/ProtectionPool.json";
import { USDC_NUM_OF_DECIMALS } from "@/utils/usdc";
import { getDecimalMul, getDaysInSeconds } from "@/utils/utils";
import useCalculatePremium from "@/hooks/useCalculatePremium";

const useBuyProtection = (
  protectionPoolAddress: Address,
  lendingPoolAddress: Address,
  protectionAmount: string,
  protectionDuration: string
) => {
  // const { data: premiumAmount } = useCalculatePremium(
  //   protectionPoolAddress,
  //   protectionAmount,
  //   Number(protectionDuration)
  // );

  const premium = getDecimalMul("6", 6);
  const { chain } = useNetwork();
  const amount: BigNumber = getDecimalMul(
    protectionAmount,
    USDC_NUM_OF_DECIMALS
  );
  const { address } = useAccount();
  const args: [any, BigNumber] = useDebounce([
    {
      lendingPoolAddress,
      nftLpTokenId: 645,
      protectionAmount: amount,
      protectionDurationInSeconds: getDaysInSeconds(protectionDuration ?? 0)
    },
    premium
  ]);

  const { addTx, recieveTx } = useTransaction();

  const prepareFn = usePrepareContractWrite({
    address: protectionPoolAddress,
    abi: ProtectionPoolABI,
    functionName: "buyProtection",
    args,
    chainId: chain?.id,
    enabled:
      !!chain?.id &&
      !!protectionPoolAddress &&
      BigNumber.from(amount).gt(0) &&
      BigNumber.from(premium).gt(0)
  });

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data: any) {
      addTx({
        chainId: chain?.id,
        address,
        type: "Transaction",
        description: "buyProtection",
        hash: data?.hash
      });
    },
    onError(error) {
      console.log("useBuyProtection write error", error);
    }
  });

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn?.data?.hash,
    onSuccess(data: any) {
      recieveTx({
        chainId: chain?.id,
        address,
        hash: data?.hash
      });
    },
    onError(error) {
      console.log("useBuyProtection wait error", error);
    }
  });

  return { prepareFn, writeFn, waitFn };
};

export default useBuyProtection;
