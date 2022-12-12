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
      protocols: goldfinchLogo,
      APY: "15 - 20%",
      totalCapital: "4,500,000 USDC",
      totalProtection: "7,000,000 USDC",
      protectionPurchaseLimit: "100,000 USDC",
      depositLimit: "51,000 USDC"
    },
    {
      address: "0x1...",
      protocols: goldfinchLogo,
      APY: "15 - 20%",
      totalCapital: "4,500,000 USDC",
      totalProtection: "7,000,000 USDC",
      protectionPurchaseLimit: "151,000 USDC",
      depositLimit: "121,000 USDC"
    }
  ];

  const [protectionPools, setProtectionPools] = useState<ProtectionPool[]>(
    defaultProtectionPools
  );
  
  useEffect(() => { 
    if (!protectionPoolFactoryService) return;
    protectionPoolFactoryService.getProtectionPools().then((protectionPools) => {
      console.log("Retrieved Protection Pools in context: ", protectionPools);
      setProtectionPools(protectionPools);
    });
  }, [protectionPoolFactoryService]);

  return (
    <ProtectionPoolContext.Provider
      value={{ protectionPools, setProtectionPools }}
    >
      {children}
    </ProtectionPoolContext.Provider>
  );
};
