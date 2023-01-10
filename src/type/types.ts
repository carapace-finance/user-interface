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
  updateProviderAndContractAddresses: (
    newProvider: JsonRpcProvider,
    newContractAddresses: ContractAddresses
  ) => void;
  protectionPoolService: ProtectionPoolService;
  protectionPoolFactoryService: ProtectionPoolFactoryService;
};

export type ProtectionPoolContextType = {
  isDefaultData: boolean;
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
  updateUserUsdcBalance: () => Promise<BigNumber>;
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
  premium: string;
}

export interface User {
  address: string;
  ETHBalance: string;
  USDCBalance: BigNumber;
  userProtectionPools: UserProtectionPool[];
  sTokenUnderlyingAmount: string;
  requestedWithdrawalAmount: string;
  userLendingPools: UserLendingPool[];
}

export interface UserProtectionPool {
  sTokenUnderlyingAmount: string;
  requestedWithdrawalAmount: string;
}

export interface UserLendingPool {
  lendingPoolAddress: string;
  protectionPremium: BigNumber;
  expirationTimestamp: BigNumber;
  protectionAmount: BigNumber;
}

export interface ProtectionInfo {
  buyer: string;
  protectionPremium: number;
  startTimestamp: BigNumber;
  K: BigNumber;
  lambda: BigNumber;
  purchaseParams: ProtectionPurchaseParams;
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
  protectionPoolInstance: Contract;
}

export interface BuyProtectionInputs {
  protectionAmount: string;
  protectionDurationInDays: string;
}

export interface SellProtectionInput {
  depositAmount: string;
}

export interface WithdrawalRequestInput {
  amount: string;
}

export interface WithdrawalInput {
  amount: string;
}
