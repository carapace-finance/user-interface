import { useMemo } from "react";
import { useQuery } from "urql";
import { GET_PROTECTION_POOLS } from "@/queries";
import { CARAPACE_SUBGRAPH_URL } from "@/constants";

export default function useQueryProtectionPools() {
  const [{ data, fetching, error }] = useQuery({
    query: GET_PROTECTION_POOLS,
    context: useMemo(
      () => ({
        url: CARAPACE_SUBGRAPH_URL
      }),
      []
    )
  });

  return {
    data: data?.protectionPools,
    fetching,
    error
  };
}
