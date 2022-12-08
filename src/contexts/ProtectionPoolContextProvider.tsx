import React, { useState, createContext } from "react";
import { ProtectionPool, ProtectionPoolContextType } from "@type/types";
import assets from "../assets";

const goldfinchLogo = assets.goldfinch.src;

export const ProtectionPoolContext =
  createContext<ProtectionPoolContextType | null>(null);

export const ProtectionPoolContextProvider = ({ children }) => {
  const defaultProtectionPools: ProtectionPool[] = [
    {
      address: "0x0...",
      protocols: goldfinchLogo,
      APY: "15 - 20%",
      totalCapital: "$1M",
      totalProtection: "$2M"
    },
    {
      address: "0x1...",
      protocols: goldfinchLogo,
      APY: "15 - 20%",
      totalCapital: "$1M",
      totalProtection: "$2M"
    }
  ];

  const [protectionPools, setProtectionPools] = useState<ProtectionPool[]>(
    defaultProtectionPools
  );

  return (
    <ProtectionPoolContext.Provider
      value={{ protectionPools, setProtectionPools }}
    >
      {children}
    </ProtectionPoolContext.Provider>
  );
};
