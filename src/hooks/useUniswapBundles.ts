import { useMemo } from "react";
import { useQuery } from "urql";
import { UNISWAP_ETH_PRICE_QUERY } from "@/queries";
import { UNISWAP_V3_SUBGRAPH_URL } from "@/constants";

export default function useUniswapBundles() {
  const [{ data, fetching, error }] = useQuery({
    query: UNISWAP_ETH_PRICE_QUERY,
    context: useMemo(
      () => ({
        url: UNISWAP_V3_SUBGRAPH_URL
      }),
      []
    )
  });

  return {
    data: data?.bundles[0]?.ethPriceUSD,
    fetching,
    error
  };
}
