import { JsonRpcProvider } from "@ethersproject/providers";

export interface DeployedContracts {
  poolCycleManagerInstance: any;
  poolFactoryInstance: any;
  protectionPoolInstance: any;
  premiumCalculatorInstance: any;
}

export interface Playground {
  forkId: string;
  provider: JsonRpcProvider;
  deployedContracts: DeployedContracts;
}

export interface PlaygroundInfo {
  forkId: string;
  url: string;
  snapshotId: string;
  poolFactoryAddress: string;
  poolAddress: string;
  poolCycleManagerAddress: string;
}
