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
