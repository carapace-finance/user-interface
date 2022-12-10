import React, { useState, createContext, useContext, useEffect } from "react";
import { LendingPool, LendingPoolContextType } from "@type/types";
import assets from "../assets";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { ProtectionPoolContext } from "./ProtectionPoolContextProvider";

const goldfinchLogo = assets.goldfinch.src;

export const LendingPoolContext = createContext<LendingPoolContextType | null>(
  null
);

export const LendingPoolContextProvider = ({ children }) => {
  const { provider, protectionPoolService } = useContext(ApplicationContext);
  const { protectionPools } = useContext(ProtectionPoolContext);
  
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

   useEffect(() => {
    if (protectionPools && provider && protectionPoolService) {
      const promises = protectionPools.map((protectionPool) => {
          return protectionPoolService.getLendingPools(protectionPool.address).then((lendingPools) => {
            console.log("Retrieved Lending Pools: ", lendingPools);
            return lendingPools.map(lendingPool => ({...lendingPool, protocol: lendingPool.protocol === "goldfinch" ? goldfinchLogo : ""}));
          });
        });

        Promise.all(promises).then((arrayOfLendingPools) => {
          const allLendingPools = arrayOfLendingPools.flat();
          setLendingPools(allLendingPools);
        });
    }
  }, [protectionPools]);
  
  return (
    <LendingPoolContext.Provider value={{ lendingPools, setLendingPools }}>
      {children}
    </LendingPoolContext.Provider>
  );
};
