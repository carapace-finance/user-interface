import React, { useState, createContext } from "react";
import { Bond, BondContextType } from "@type/types";
import assets from "../assets";

const goldfinchLogo = assets.goldfinch.src;

export const BondContext = createContext<BondContextType | null>(null);

export const BondContextProvider = ({ children }) => {
  const defaultBonds: Bond[] = [
    {
      poolTokenId: "424",
      price: "2542 USDC",
      lendingPool: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      premium: "4 - 7%"
    },
    {
      poolTokenId: "342",
      price: "42424242 USDC",
      lendingPool: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      premium: "4 - 7%"
    },
    {
      poolTokenId: "42774",
      price: "900000 USDC",
      lendingPool: "Almavest Basket #6",
      protocol: goldfinchLogo,
      adjustedYields: "7 - 10%",
      lendingPoolAPY: "17%",
      premium: "4 - 7%"
    }
  ];

  const [bonds, setBonds] = useState<Bond[]>(defaultBonds);

  return (
    <BondContext.Provider value={{ bonds, setBonds }}>
      {children}
    </BondContext.Provider>
  );
};
