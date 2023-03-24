import { useMemo } from "react";
import { useQuery } from "urql";
import { GET_LENDING_POOLS } from "@/queries";
import { CARAPACE_SUBGRAPH_URL } from "@/constants";

export default function useQueryLendingPools() {
  const [{ data, fetching, error }] = useQuery({
    query: GET_LENDING_POOLS,
    context: useMemo(
      () => ({
        url: CARAPACE_SUBGRAPH_URL
      }),
      []
    )
  });

  return {
    data: data?.lendingPools,
    fetching,
    error
  };
}
