import { gql } from "urql";

export const UNISWAP_ETH_PRICE_QUERY = gql`
  query {
    bundles(first: 1) {
      id
      ethPriceUSD
    }
  }
`;

// Protection Pool
const PROTECTION_POOL_FRAGMENT = gql`
  fragment ProtectionPoolFragment on ProtectionPool {
    id
    cycleDuration
    currentCycleStartTime
    currentCycleIndex
    underlyingToken
    totalSTokenUnderlying
    totalProtection
    referenceLendingPools
    protectionRenewalGracePeriodInSeconds
    openCycleDuration
    minProtectionDurationInSeconds
    leverageRatio
  }
`;

export const GET_PROTECTION_POOLS = gql`
  ${PROTECTION_POOL_FRAGMENT}
  query {
    protectionPools {
      ...ProtectionPoolFragment
    }
  }
`;

export const GET_PROTECTION_POOL = gql`
  ${PROTECTION_POOL_FRAGMENT}
  query ($id: ID!) {
    protectionPool(id: $id) {
      ...ProtectionPoolFragment
    }
  }
`;

// Lending Pool
const LENDING_POOL_FRAGMENT = gql`
  fragment LendingPoolFragment on LendingPool {
    id
    protocol
    totalProtection
    addedTimestamp
    protectionPurchaseLimitTimestamp
  }
`;

export const GET_LENDING_POOLS = gql`
  ${LENDING_POOL_FRAGMENT}
  query {
    lendingPools {
      ...LendingPoolFragment
    }
  }
`;

export const GET_LENDING_POOL = gql`
  ${LENDING_POOL_FRAGMENT}
  query ($id: ID!) {
    lendingPool(id: $id) {
      ...LendingPoolFragment
    }
  }
`;
