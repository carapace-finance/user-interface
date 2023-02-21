import { useContractRead, erc20ABI, useNetwork } from "wagmi";
import useDebounce from "@/hooks/useDebounce";
import type { Address } from "abitype";

const useAllowance = (
  targetAddress: Address,
  owner: Address,
  spender: Address
) => {
  const { chain } = useNetwork();
  const args: [Address, Address] = useDebounce([owner, spender], 300);
  const enabled: boolean = useDebounce(
    !!chain && !!targetAddress && !!owner && !!spender,
    300
  );

  const readFn = useContractRead({
    address: targetAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args,
    enabled,
    scopeKey: `useAllowance-${targetAddress}`,
    chainId: chain?.id,
    onError(error: any) {
      console.log("allowance error", error);
    }
  });

  return {
    ...readFn,
    isLoaded: readFn.isFetched && !readFn.isFetching && readFn.isSuccess
  };
};

export default useAllowance;
