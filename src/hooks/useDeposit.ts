import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
  useNetwork
} from "wagmi";
import useDebounce from "@hooks/useDebounce";
import { BigNumber } from "@ethersproject/bignumber";
import { getDecimalMul } from "@utils/utils";
import type { Address } from "abitype";
import ProtectionPoolABI from "@contracts/mainnet/abi/ProtectionPool.json";

const useDeposit = (amount: string, protectionPoolAddress: Address) => {
  const { chain } = useNetwork();
  const _amount = getDecimalMul(amount, 6);
  const { address } = useAccount();
  const args: [BigNumber, Address] = useDebounce([_amount, address]);

  const prepareFn = usePrepareContractWrite({
    address: protectionPoolAddress,
    abi: ProtectionPoolABI,
    functionName: "deposit",
    args,
    chainId: chain?.id,
    enabled: !!chain && !!protectionPoolAddress && BigNumber.from(amount).gt(0)
  });

  const writeFn = useContractWrite(prepareFn.config);

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn?.data?.hash
  });

  return { prepareFn, writeFn, waitFn };
};

export default useDeposit;
