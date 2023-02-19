import { useBalance, useAccount, useNetwork } from "wagmi";
import type { Address } from "abitype";
import { USDC_ADDRESS } from "@/utils/usdc";

const useUsdcBalance = (owner?: Address) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const balance = useBalance({
    address: address,
    token: USDC_ADDRESS,
    chainId: chain?.id,
    scopeKey: "usdcBalance",
    enabled: !!address
  });

  console.log("balance::", balance);
  return balance;
};

export default useUsdcBalance;
