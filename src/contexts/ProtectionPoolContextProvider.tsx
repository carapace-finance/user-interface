import React, { useState, createContext, useContext, useEffect } from "react";
import { ProtectionPool, ProtectionPoolContextType } from "@type/types";
import assets from "../assets";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { getProtectionPoolContract } from "@contracts/contractService";
import numeral from "numeral";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";

const goldfinchLogo = assets.goldfinch.src;

export const ProtectionPoolContext =
  createContext<ProtectionPoolContextType | null>(null);

export const ProtectionPoolContextProvider = ({ children }) => {
  const { provider, protectionPoolFactoryService } =
    useContext(ApplicationContext);
  const defaultProtectionPools: ProtectionPool[] = [
    {
      address: "0xPP...",
      name: "Goldfinch Protection Pool #1",
      protocols: goldfinchLogo,
      APY: "15 - 20%",
      totalCapital: "4,500,000",
      totalProtection: "7,000,000",
      protectionPurchaseLimit: "9,000,000", // totalCapital / leverageRatioFloor
      leverageRatioFloor: "500000", // get the actual leverageRatioFloor value by dividing this value by 10 ** USDC_NUM_OF_DECIMALS
      leverageRatioCeiling: "1000000", // get the actual leverageRatioCeiling value by dividing this value by 10 ** USDC_NUM_OF_DECIMALS
      depositLimit: "7,000,000" // totalProtection * leverageRatioCeiling
    }
  ];

  const [protectionPools, setProtectionPools] = useState<ProtectionPool[]>(
    defaultProtectionPools
  );
  const [isDefaultData, setIsDefaultData] = useState(true);

  useEffect(() => {
    if (provider && protectionPoolFactoryService) {
      protectionPoolFactoryService
        .getProtectionPools()
        .then((newProtectionPools) => {
          console.log(
            "Retrieved Protection Pools in context: ",
            newProtectionPools
          );
          setProtectionPools(newProtectionPools);
          setIsDefaultData(false);

          newProtectionPools.forEach((protectionPool) => {
            const protectionPoolInstance = getProtectionPoolContract(
              protectionPool.address,
              provider.getSigner()
            );
            protectionPoolInstance.on(
              "ProtectionBought",
              async (
                buyerAddress,
                lendingPoolAddress,
                protectionAmount,
                premium,
                event
              ) => {
                console.log("ProtectionBought event triggered: ", event.args);
                const totalProtection =
                  await protectionPoolInstance.totalProtection();
                const updatedProtectionPools = newProtectionPools.map((p) => {
                  if (p.address === protectionPool.address) {
                    return {
                      ...p,
                      totalProtection: numeral(
                        convertUSDCToNumber(totalProtection)
                      ).format(USDC_FORMAT)
                    };
                  }
                  return p;
                });
                console.log(
                  "Updated protection pools: ",
                  updatedProtectionPools
                );
                setProtectionPools(updatedProtectionPools);
              }
            );

            protectionPoolInstance.on(
              "ProtectionSold",
              async (userAddress, amount, event) => {
                console.log("ProtectionSold event triggered: ", event.args);
                const totalCapital =
                  await protectionPoolInstance.totalSTokenUnderlying();
                const updatedProtectionPools = newProtectionPools.map((p) => {
                  if (p.address === protectionPool.address) {
                    return {
                      ...p,
                      totalCapital: numeral(
                        convertUSDCToNumber(totalCapital)
                      ).format(USDC_FORMAT)
                    };
                  }
                  return p;
                });
                console.log(
                  "Updated protection pools: ",
                  updatedProtectionPools
                );
                setProtectionPools(updatedProtectionPools);
              }
            );
          });
        });
    } else {
      setProtectionPools(defaultProtectionPools);
      setIsDefaultData(true);
    }
  }, [provider, protectionPoolFactoryService]);

  return (
    <ProtectionPoolContext.Provider
      value={{ isDefaultData, protectionPools, setProtectionPools }}
    >
      {children}
    </ProtectionPoolContext.Provider>
  );
};
