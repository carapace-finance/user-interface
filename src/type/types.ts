import { JsonRpcProvider } from "@ethersproject/providers";
import { ProtectionPoolService } from "@services/ProtectionPoolService";

export interface ContractAddresses {
  isPlayground: boolean;
  poolFactory: string;
  pool: string;
}

export type ContractAddressesContextType = {
  provider: JsonRpcProvider;
  contractAddresses: ContractAddresses;
  updateContractAddresses: (newContractAddresses: ContractAddresses) => void;
  updateProvider: (newProvider: JsonRpcProvider) => void;
  protectionPoolService: ProtectionPoolService;
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
