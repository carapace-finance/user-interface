import { useMemo } from "react";
import { useQuery } from "urql";
import { GET_PROTECTION_POOL } from "@/queries";
import { CARAPACE_SUBGRAPH_URL } from "@/constants";

export default function useQueryProtectionPool(id: string) {
  const [{ data, fetching, error }] = useQuery({
    query: GET_PROTECTION_POOL,
    variables: { id },
    pause: !id,
    context: useMemo(
      () => ({
        url: CARAPACE_SUBGRAPH_URL
      }),
      []
    )
  });

  return {
    data: data?.protectionPool,
    fetching,
    error
  };
}
