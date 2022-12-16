import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ProtectionPoolFactoryService } from "@services/ProtectionPoolFactoryService";
import { ProtectionPoolService } from "@services/ProtectionPoolService";
import { BigNumber } from "ethers";

export interface ContractAddresses {
  isPlayground: boolean;
  poolFactory: string;
  pool: string;
  premiumCalculator: string;
}

export type ApplicationContextType = {
  provider: JsonRpcProvider;
  contractAddresses: ContractAddresses;
  updateContractAddresses: (newContractAddresses: ContractAddresses) => void;
  updateProvider: (newProvider: JsonRpcProvider) => void;
  protectionPoolService: ProtectionPoolService;
  protectionPoolFactoryService: ProtectionPoolFactoryService;
};

export type ProtectionPoolContextType = {
  protectionPools: ProtectionPool[];
  setProtectionPools: (protectionPools: ProtectionPool[]) => void;
};

export type LendingPoolContextType = {
  lendingPools: LendingPool[];
  setLendingPools: (lendingPools: LendingPool[]) => void;
};

export type BondContextType = {
  bonds: Bond[];
  setBonds: (bonds: Bond[]) => void;
};

export type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

export interface ProtectionPool {
  address: string;
  name: string;
  protocols: string;
  APY: string;
  totalCapital: string;
  totalProtection: string;
  protectionPurchaseLimit: string;
  leverageRatioFloor: string;
  leverageRatioCeiling: string;
  depositLimit: string;
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
  // Total amount of protection purchased in the protection pool for this lending pool
  protectionPurchase: string;
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

export interface User {
  address: string;
  ETHBalance: string;
  USDCBalance: BigNumber;
  sTokenUnderlyingAmount: string;
  requestedWithdrawalAmount: string;
  protectionAmount: string;
  protectionDuration: string;
  protectionPurchases: ProtectionPurchase[];
}

export interface ProtectionPurchaseParams {
  lendingPoolAddress: string;
  nftLpTokenId: number;
  protectionAmount: BigNumber;
  protectionDurationInSeconds: BigNumber;
}

export interface ProtectionPurchase {
  protectionPool: string;
  buyer: string;
  purchaseParams: ProtectionPurchaseParams;
  startTimestamp: BigNumber;
  premium: BigNumber;
}

export interface deployedContracts {
  poolCycleManagerInstance: Contract;
  poolFactoryInstance: Contract;
  poolInstance: Contract;
}

export interface BuyProtectionInputs {
  protectionAmount: number;
  protectionDurationInDays: number;
}
