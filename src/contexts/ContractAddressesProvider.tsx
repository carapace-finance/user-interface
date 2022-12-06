import { JsonRpcProvider } from "@ethersproject/providers";
import { ContractAddresses, ContractAddressesContextType } from "@type/types";
import { createContext, useState } from "react";
import { ProtectionPoolService } from "../services/ProtectionPoolService";

export const ContractAddressesContext =
  createContext<ContractAddressesContextType | null>(null);

export const ContractAddressesProvider = ({ children }) => {
  const [contractAddresses, setContractAddresses] = useState(null);
  const [provider, setProvider] = useState(null);
  const updateContractAddresses = (newContractAddresses: ContractAddresses) => {
    console.log("Updating contract addresses", newContractAddresses);
    setContractAddresses(newContractAddresses);
  };
  const updateProvider = (provider: JsonRpcProvider) => {
    console.log("Updating provider", provider);
    setProvider(provider);
  };

  return (
    <ContractAddressesContext.Provider
      value={{
        provider,
        contractAddresses,
        updateContractAddresses,
        updateProvider,
        protectionPoolService: provider ? new ProtectionPoolService(provider, contractAddresses.isPlayground) : null
      }}
    >
      {children}
    </ContractAddressesContext.Provider>
  );
};
