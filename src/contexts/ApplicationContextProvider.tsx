import { JsonRpcProvider } from "@ethersproject/providers";
import { ContractAddresses, ApplicationContextType } from "@type/types";
import { createContext, useEffect, useState } from "react";
import { ProtectionPoolService } from "../services/ProtectionPoolService";
import { ProtectionPoolFactoryService } from "../services/ProtectionPoolFactoryService";

export const ApplicationContext = createContext<ApplicationContextType | null>(
  null
);

export const ApplicationContextProvider = ({ children }) => {
  const [contractAddresses, setContractAddresses] = useState(null);
  const [provider, setProvider] = useState(null);
  const [protectionPoolService, setProtectionPoolService] = useState(null);
  const [protectionPoolFactoryService, setProtectionPoolFactoryService] =
    useState(null);

  const updateProviderAndContractAddresses = (
    provider: JsonRpcProvider,
    newContractAddresses: ContractAddresses
  ) => {
    console.log("Updating provider & contract addresses");
    setProvider(provider);
    setContractAddresses(newContractAddresses);
  };

  useEffect(() => {
    if (provider && contractAddresses?.poolFactory) {
      console.log("Updating protection pool & factory service");
      setProtectionPoolService(
        new ProtectionPoolService(provider, contractAddresses.isPlayground)
      );
      setProtectionPoolFactoryService(
        new ProtectionPoolFactoryService(
          provider,
          contractAddresses.isPlayground,
          contractAddresses.poolFactory
        )
      );
    } else {
      setProtectionPoolService(null);
      setProtectionPoolFactoryService(null);
    }
  }, [contractAddresses?.poolFactory, provider]);

  return (
    <ApplicationContext.Provider
      value={{
        provider,
        contractAddresses,
        updateProviderAndContractAddresses,
        protectionPoolService,
        protectionPoolFactoryService
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
