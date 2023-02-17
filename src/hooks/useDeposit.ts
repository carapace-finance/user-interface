"use client";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount
} from "wagmi";
import { BigNumber } from "@ethersproject/bignumber";
import { getDecimalMulString } from "@utils/utils";
import { Address } from "abitype";
import ProtectionPoolABI from "@contracts/mainnet/abi/ProtectionPool.json";

export default function useDeposit(
  amount: string,
  protectionPoolAddress: Address
) {
  const _amount = getDecimalMulString(amount, 6);
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: protectionPoolAddress,
    abi: ProtectionPoolABI,
    functionName: "deposit",
    args: [_amount, address],
    enabled: !!protectionPoolAddress && BigNumber.from(amount).gt(0)
  });

  const writeFn = useContractWrite(config);

  const waitFn = useWaitForTransaction({
    hash: writeFn?.data?.hash
  });

  return { writeFn, waitFn };
}
