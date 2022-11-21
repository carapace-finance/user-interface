import { JsonRpcProvider } from "@ethersproject/providers";

export interface DeployedContracts {
  poolCycleManagerInstance: any;
  poolFactoryInstance: any;
  poolInstance: any;
}

export interface Playground {
  provider: JsonRpcProvider;
  deployedContracts: DeployedContracts;
}
