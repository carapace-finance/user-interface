import { useContractRead, erc20ABI, useNetwork } from "wagmi";
import useDebounce from "@hooks/useDebounce";
import type { Address } from "abitype";

const useAllowance = (
  targetAddress: Address,
  owner: Address,
  spender: Address
) => {
  const { chain } = useNetwork();
  const args: [Address, Address] = useDebounce([owner, spender], 300);
  const enabled: boolean = useDebounce(
    !!targetAddress && !!owner && !!spender,
    300
  );

  const readFn = useContractRead({
    address: targetAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args,
    enabled,
    chainId: chain.id,
    onError(error: any) {
      console.log("allowance error", error);
    }
  });

  return {
    ...readFn,
    data: readFn?.data,
    isLoaded: readFn.isFetched && !readFn.isFetching && readFn.isSuccess
  };
};

export default useAllowance;
