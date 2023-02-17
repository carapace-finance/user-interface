"use client";
import { useBalance, useAccount } from "wagmi";
import { Address } from "abitype";

export default function useUsdcBalance(owner?: Address) {
  const { address } = useAccount();

  const res = useBalance({
    address: owner ?? address,
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    watch: true,
    scopeKey: "usdcBalance",
    enabled: !!owner || !!address
  });

  return res;
}
