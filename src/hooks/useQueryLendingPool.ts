import { useMemo } from "react";
import { useQuery } from "urql";
import { GET_LENDING_POOL } from "@/queries";
import { CARAPACE_SUBGRAPH_URL } from "@/constants";

export default function useQueryLendingPool(id: string) {
  const [{ data, fetching, error }] = useQuery({
    query: GET_LENDING_POOL,
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
    data: data?.lendingPool,
    fetching,
    error
  };
}
