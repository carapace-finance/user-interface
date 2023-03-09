import { createClient, gql } from "urql";
import { UNISWAP_V3_SUBGRAPH_URL } from "@/constants";

const uniswapClient = createClient({
  url: UNISWAP_V3_SUBGRAPH_URL
});

export const UNISWAP_ETH_PRICE_QUERY = gql`
  query {
    bundles(first: 1) {
      id
      ethPriceUSD
    }
  }
`;
