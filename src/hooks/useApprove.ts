import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  erc20ABI,
  useAccount,
  useNetwork
} from "wagmi";
import useDebounce from "@hooks/useDebounce";
import useTransaction from "@/hooks/useTransaction";
import { BigNumber } from "ethers";
import type { Address } from "abitype";

const useApprove: any = (
  targetAddress: Address,
  owner: Address,
  spender: Address
) => {
  const { chain } = useNetwork();
  const { addTx, recieveTx } = useTransaction();
  const { address } = useAccount();

  const args: [Address, BigNumber] = useDebounce([
    spender,
    BigNumber.from(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    )
  ]);
  const enabled: boolean = useDebounce(
    !!chain && !!targetAddress && !!owner && !!spender
  );

  const prepareFn = usePrepareContractWrite({
    address: targetAddress,
    abi: erc20ABI,
    functionName: "approve",
    overrides: { from: owner },
    args,
    enabled,
    chainId: chain?.id,
    onError(error) {
      console.log("useApprove prepare error", error);
    }
  });

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data: any) {
      addTx({
        chainId: chain?.id,
        address,
        type: "Transaction",
        description: "Approve",
        hash: data?.hash
      });
    },
    onError(error) {
      console.log("useApprove write error", error);
    }
  });

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
    onSuccess(data: any) {
      recieveTx({
        chainId: chain?.id,
        address,
        hash: data?.hash
      });
    },
    onError(error) {
      console.log("useApprove wait error", error);
    }
  });

  return {
    prepareFn,
    writeFn,
    waitFn
  };
};

export default useApprove;
