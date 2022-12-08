import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import poolFactoryAbi from "../contracts/forked/abi/PoolFactory.json";
import poolAbi from "../contracts/forked/abi/Pool.json";
import poolCycleManagerAbi from "../contracts/forked/abi/PoolCycleManager.json";
import referenceLendingPoolsAbi from "../contracts/forked/abi/ReferenceLendingPools.json";
import tranchedPoolAbi from "../contracts/forked/abi/ITranchedPool.json";

export const getPoolFactoryContract = (address: string, signer: Signer) => {
  return new Contract(address, poolFactoryAbi, signer);
};

export const getPoolContract = (address: string, signer: Signer) => {
  return new Contract(address, poolAbi, signer);
};

export const getReferenceLendingPoolsContract = (
  address: string,
  signer: Signer
) => {
  return new Contract(address, referenceLendingPoolsAbi, signer);
};

export const getTranchedPoolContract = (address: string, signer: Signer) => {
  return new Contract(address, tranchedPoolAbi, signer);
};

export const getPoolCycleManagerContract = (
  address: string,
  signer: Signer
) => {
  return new Contract(address, poolCycleManagerAbi, signer);
};
