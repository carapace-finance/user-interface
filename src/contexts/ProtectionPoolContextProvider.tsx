import React, { useState, createContext, useContext, useEffect } from "react";
import { ProtectionPool, ProtectionPoolContextType } from "@type/types";
import assets from "../assets";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";

const goldfinchLogo = assets.goldfinch.src;

export const ProtectionPoolContext =
  createContext<ProtectionPoolContextType | null>(null);

export const ProtectionPoolContextProvider = ({ children }) => {
  const { protectionPoolFactoryService } = useContext(ApplicationContext);
  const defaultProtectionPools: ProtectionPool[] = [
    {
      address: "0x0...",
      name: "Goldfinch Protection Pool #1",
      protocols: goldfinchLogo,
      APY: "15 - 20%",
      totalCapital: "4,500,000 USDC",
      totalProtection: "7,000,000 USDC",
      protectionPurchaseLimit: "9,000,000 USDC", // totalCapital / leverageRatioFloor
      leverageRatioFloor: "500000", // get the actual leverageRatioFloor value by dividing this value by 10 ** USDC_NUM_OF_DECIMALS
      leverageRatioCeiling: "1000000", // get the actual leverageRatioCeiling value by dividing this value by 10 ** USDC_NUM_OF_DECIMALS
      depositLimit: "7,000,000 USDC" // totalProtection * leverageRatioCeiling
    }
  ];

  const [protectionPools, setProtectionPools] = useState<ProtectionPool[]>(
    defaultProtectionPools
  );
  const [isDefaultData, setIsDefaultData] = useState(true);

  useEffect(() => {
    if (protectionPoolFactoryService) {
      protectionPoolFactoryService
        .getProtectionPools()
        .then((protectionPools) => {
          console.log(
            "Retrieved Protection Pools in context: ",
            protectionPools
          );
          setProtectionPools(protectionPools);
          setIsDefaultData(false);
        });
    } else {
      setProtectionPools(defaultProtectionPools);
      setIsDefaultData(true);
    }
  }, [protectionPoolFactoryService]);

  return (
    <ProtectionPoolContext.Provider
      value={{ isDefaultData, protectionPools, setProtectionPools }}
    >
      {children}
    </ProtectionPoolContext.Provider>
  );
};
