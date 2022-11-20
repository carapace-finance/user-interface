import { JsonRpcProvider } from "@ethersproject/providers";
import { ContractAddresses, ContractAddressesContextType } from "@type/ContractAddressesContextType";
import { createContext, useState } from "react";

export const ContractAddressesContext = createContext<ContractAddressesContextType | null>(null);

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
  }

  return (
    <ContractAddressesContext.Provider
      value={{ provider, contractAddresses, updateContractAddresses, updateProvider }}
    >
      {children}
    </ContractAddressesContext.Provider>
  );
};
