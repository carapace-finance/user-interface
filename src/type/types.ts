import { JsonRpcProvider } from "@ethersproject/providers";
import { ProtectionPoolService } from "@services/ProtectionPoolService";

export interface ContractAddresses {
  isPlayground: boolean;
  poolFactory: string;
  pool: string;
}

export type ApplicationContextType = {
  provider: JsonRpcProvider;
  contractAddresses: ContractAddresses;
  updateContractAddresses: (newContractAddresses: ContractAddresses) => void;
  updateProvider: (newProvider: JsonRpcProvider) => void;
  protectionPoolService: ProtectionPoolService;
};


export type LendingPoolContextType = {
  lendingPools: LendingPool[];
  setLendingPools: (lendingPools: LendingPool[]) => void;
};

export type BondContextType = {
  bonds: Bond[];
  setBonds: (bonds: Bond[]) => void;
};

export interface ProtectionPool {
  address: string;
  APY: string;
  protocols: string;
  totalCapital: string;
  totalProtection: string;
}

export interface LendingPool {
  address: string;
  name: string;
  protocol: string;
  adjustedYields: string;
  lendingPoolAPY: string;
  CARATokenRewards: string;
  premium: string;
  timeLeft: string;
  protectionPoolAddress: string;
}

export interface Bond {
  poolTokenId: string;
  price: string;
  lendingPool: string;
  protocol: string;
  adjustedYields: string;
  lendingPoolAPY: string;
  CARATokenRewards: string;
  premium: string;
}

export interface ProtectionPurchaseParams {
  lendingPoolAddress: string;
  nftLpTokenId: string;
  protectionAmount: string;
  protectionDurationInSeconds: string;
}
