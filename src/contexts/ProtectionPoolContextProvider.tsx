import React, { useState, createContext, useContext, useEffect } from "react";
import { ProtectionPool, ProtectionPoolContextType } from "@type/types";
import assets from "../assets";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { getPoolContract } from "@contracts/contractService";
import numeral from "numeral";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";

const goldfinchLogo = assets.goldfinch.src;

export const ProtectionPoolContext =
  createContext<ProtectionPoolContextType | null>(null);

export const ProtectionPoolContextProvider = ({ children }) => {
  const { provider, protectionPoolFactoryService } = useContext(ApplicationContext);
  const defaultProtectionPools: ProtectionPool[] = [
    {
      address: "0xPP...",
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
            const poolInstance = getPoolContract(protectionPool.address, provider.getSigner());
            poolInstance.on(
              "ProtectionBought",
              async (buyerAddress, lendingPoolAddress, protectionAmount, premium, event) => {
                console.log("ProtectionBought event triggered: ", event.args);
                const totalProtection = await poolInstance.totalProtection();
                const updatedProtectionPools = newProtectionPools.map((p) => { 
                  if (p.address === protectionPool.address) {
                    return {
                      ...p,
                      totalProtection: numeral(convertUSDCToNumber(totalProtection)).format(USDC_FORMAT) + " USDC"
                    };
                  }
                  return p;
                });
                console.log("Updated protection pools: ", updatedProtectionPools);
                setProtectionPools(updatedProtectionPools);
              }
            );

            poolInstance.on(
              "ProtectionSold",
              async (userAddress, amount, event) => {
                console.log("ProtectionSold event triggered: ", event.args);
                const totalCapital = await poolInstance.totalSTokenUnderlying();
                const updatedProtectionPools = newProtectionPools.map((p) => { 
                  if (p.address === protectionPool.address) {
                    return {
                      ...p,
                      totalCapital: numeral(convertUSDCToNumber(totalCapital)).format(USDC_FORMAT) + " USDC"
                    };
                  }
                  return p;
                });
                console.log("Updated protection pools: ", updatedProtectionPools);
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
