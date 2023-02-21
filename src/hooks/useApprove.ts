import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  erc20ABI,
  useNetwork
} from "wagmi";
import useDebounce from "@hooks/useDebounce";
import { BigNumber } from "ethers";
import type { Address } from "abitype";

const useApprove: any = (
  targetAddress: Address,
  owner: Address,
  spender: Address
) => {
  const { chain } = useNetwork();

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
    onSuccess(data) {
      // todo: add tx handling
    },
    onError(error) {
      console.log("useApprove write error", error);
    }
  });

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash
  });

  return {
    prepareFn,
    writeFn,
    waitFn
  };
};

export default useApprove;
