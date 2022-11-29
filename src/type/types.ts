import { JsonRpcProvider } from "@ethersproject/providers";

export interface ContractAddresses {
  poolFactory: string;
  pool: string;
}

export type ContractAddressesContextType = {
  provider: JsonRpcProvider;
  contractAddresses: ContractAddresses;
  updateContractAddresses: (newContractAddresses: ContractAddresses) => void;
  updateProvider: (newProvider: JsonRpcProvider) => void;
};

export interface ProtectionPool {
  id: number;
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
