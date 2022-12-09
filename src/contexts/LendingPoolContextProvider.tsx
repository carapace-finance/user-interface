import React, { useState, createContext } from "react";
import { LendingPool, LendingPoolContextType } from "@type/types";
import assets from "../assets";

const goldfinchLogo = assets.goldfinch.src;

export const LendingPoolContext = createContext<LendingPoolContextType | null>(
  null
);

export const LendingPoolContextProvider = ({ children }) => {
  const defaultLendingPools: LendingPool[] = [
    {
      address: "0x00...",
      name: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      CARATokenRewards: "~3.5%",
      premium: "4 - 7%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0x0..."
    },
    {
      address: "0x01...",
      name: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      CARATokenRewards: "~3.5%",
      premium: "4 - 7%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0x0..."
    }
  ];

  const [lendingPools, setLendingPools] =
    useState<LendingPool[]>(defaultLendingPools);

  return (
    <LendingPoolContext.Provider value={{ lendingPools, setLendingPools }}>
      {children}
    </LendingPoolContext.Provider>
  );
};
