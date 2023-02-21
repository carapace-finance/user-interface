import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import poolFactoryAbi from "./playground/abi/PoolFactory.json";
import poolAbi from "./playground/abi/Pool.json";
import poolCycleManagerAbi from "./playground/abi/PoolCycleManager.json";
import referenceLendingPoolsAbi from "./playground/abi/ReferenceLendingPools.json";
import tranchedPoolAbi from "./playground/abi/ITranchedPool.json";
import creditLineAbi from "./playground/abi/ICreditLine.json";
import premiumCalculatorAbi from "./playground/abi/PremiumCalculator.json";
import { isAddress } from "ethers/lib/utils";

export const getPoolFactoryContract = (address: string, signer: Signer) => {
  if (!isAddress(address)) {
    throw new Error("PoolFactory contract address is not valid");
  }
  return new Contract(address, poolFactoryAbi, signer);
};

export const getProtectionPoolContract = (address: string, signer: Signer) => {
  if (!isAddress(address)) {
    throw new Error("Pool contract address is not valid");
  }
  return new Contract(address, poolAbi, signer);
};

export const getReferenceLendingPoolsContract = (
  address: string,
  signer: Signer
) => {
  if (!isAddress(address)) {
    throw new Error("ReferenceLendingPools contract address is not valid");
  }
  return new Contract(address, referenceLendingPoolsAbi, signer);
};

export const getTranchedPoolContract = (address: string, signer: Signer) => {
  if (!isAddress(address)) {
    throw new Error("TranchedPool contract address is not valid");
  }
  return new Contract(address, tranchedPoolAbi, signer);
};

export const getCreditLineContract = (address: string, signer: Signer) => {
  if (!isAddress(address)) {
    throw new Error("CreditLine contract address is not valid");
  }
  return new Contract(address, creditLineAbi, signer);
};

export const getPoolCycleManagerContract = (
  address: string,
  signer: Signer
) => {
  if (!isAddress(address)) {
    throw new Error("PoolCycleManager contract address is not valid");
  }
  return new Contract(address, poolCycleManagerAbi, signer);
};

export const getPremiumCalculatorContract = (
  address: string,
  signer: Signer
) => {
  if (!isAddress(address)) {
    throw new Error("PremiumCalculator contract address is not valid");
  }
  return new Contract(address, premiumCalculatorAbi, signer);
};
