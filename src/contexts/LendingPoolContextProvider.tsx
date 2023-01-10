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
  const { isDefaultData, protectionPools } = useContext(ProtectionPoolContext);

  const defaultLendingPools: LendingPool[] = [
    {
      address: "0xb26b42dd5771689d0a7faeea32825ff9710b9c11",
      name: "Lend East #1: Emerging Asia Fintech Pool",
      protocol: goldfinchLogo,
      adjustedYields: "11%",
      lendingPoolAPY: "17%",
      premium: "6%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0xPP...",
      protectionPurchase: "51,000 USDC"
    },
    {
      address: "0xd09a57127bc40d680be7cb061c2a6629fe71abef",
      name: "Cauris Fund #2: Africa Innovation Pool",
      protocol: goldfinchLogo,
      adjustedYields: "11%",
      lendingPoolAPY: "17%",
      premium: "6%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0xPP...",
      protectionPurchase: "21,000 USDC"
    },
    {
      address: "0x89d7c618a4eef3065da8ad684859a547548e6169",
      name: "Asset-Backed Pool via Addem Capital",
      protocol: goldfinchLogo,
      adjustedYields: "11%",
      lendingPoolAPY: "17%",
      premium: "6%",
      timeLeft: "7 Days 8 Hours 2 Mins",
      protectionPoolAddress: "0x0...",
      protectionPurchase: "21,000 USDC"
    }
  ];

  const [lendingPools, setLendingPools] =
    useState<LendingPool[]>(defaultLendingPools);

  useEffect(() => {
    if (
      !isDefaultData &&
      protectionPools &&
      provider &&
      protectionPoolService
    ) {
      const promises = protectionPools.map((protectionPool) => {
        return protectionPoolService
          .getLendingPools(protectionPool.address)
          .then((lendingPools) => {
            console.log("Retrieved Lending Pools: ", lendingPools);
            return lendingPools.map((lendingPool) => ({
              ...lendingPool,
              protocol:
                lendingPool.protocol === "goldfinch" ? goldfinchLogo : ""
            }));
          });
      });

      Promise.all(promises).then((arrayOfLendingPools) => {
        const allLendingPools = arrayOfLendingPools.flat();
        setLendingPools(allLendingPools);
      });
    } else {
      setLendingPools(defaultLendingPools);
    }
  }, [isDefaultData, protectionPools]);

  return (
    <LendingPoolContext.Provider value={{ lendingPools, setLendingPools }}>
      {children}
    </LendingPoolContext.Provider>
  );
};
