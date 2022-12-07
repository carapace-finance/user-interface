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
      address: "0x0...",
      name: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      CARATokenRewards: "~3.5%",
      premium: "4 - 7%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0xTest1"
    },
    {
      address: "0x1...",
      name: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      CARATokenRewards: "~3.5%",
      premium: "4 - 7%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0xTest2"
    },
    {
      address: "0x2...",
      name: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      CARATokenRewards: "~3.5%",
      premium: "4 - 7%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0xTest3"
    },
    {
      address: "0x3...",
      name: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      CARATokenRewards: "~3.5%",
      premium: "4 - 7%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0xTest4"
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
