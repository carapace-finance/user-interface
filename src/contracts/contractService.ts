import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import poolFactoryAbi from "../contracts/forked/abi/PoolFactory.json";
import poolAbi from "../contracts/forked/abi/Pool.json";
import poolCycleManagerAbi from "../contracts/forked/abi/PoolCycleManager.json";
import referenceLendingPoolsAbi from "../contracts/forked/abi/ReferenceLendingPools.json";
import tranchedPoolAbi from "../contracts/forked/abi/ITranchedPool.json";
import premiumCalculatorAbi from "../contracts/forked/abi/PremiumCalculator.json";
import { isAddress } from "ethers/lib/utils";

export const getPoolFactoryContract = (address: string, signer: Signer) => {
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
