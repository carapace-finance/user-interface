import { JsonRpcProvider } from "@ethersproject/providers";

export interface DeployedContracts {
  poolCycleManagerInstance: any;
  poolFactoryInstance: any;
  poolInstance: any;
}

export interface Playground {
  forkId: string;
  provider: JsonRpcProvider;
  deployedContracts: DeployedContracts;
}
