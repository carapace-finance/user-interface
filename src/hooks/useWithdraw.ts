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
import { getDecimalMul } from "@/utils/utils";
import type { Address } from "abitype";
import ProtectionPoolABI from "@/contracts/mainnet/abi/ProtectionPool.json";

const useWithdraw = (amount: string, protectionPoolAddress: Address) => {
  const { chain } = useNetwork();
  const _amount = getDecimalMul(amount, 18);
  const { address } = useAccount();
  const args: [BigNumber, Address] = useDebounce([_amount, address]);
  const { addTx, recieveTx } = useTransaction();

  const prepareFn = usePrepareContractWrite({
    address: protectionPoolAddress,
    abi: ProtectionPoolABI,
    functionName: "withdraw",
    args,
    chainId: chain?.id,
    enabled: !!chain && !!protectionPoolAddress && BigNumber.from(amount).gt(0)
  });

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data: any) {
      addTx({
        chainId: chain?.id,
        address,
        type: "Transaction",
        description: "Withdraw",
        hash: data?.hash
      });
    },
    onError(error) {
      console.log("useWithdraw write error", error);
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
      console.log("useWithdraw wait error", error);
    }
  });

  return { prepareFn, writeFn, waitFn };
};

export default useWithdraw;
