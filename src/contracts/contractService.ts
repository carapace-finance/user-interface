import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import poolFactoryAbi from "../contracts/forked/abi/PoolFactory.json";
import poolAbi from "../contracts/forked/abi/Pool.json";
import referenceLendingPoolsAbi from "../contracts/forked/abi/ReferenceLendingPools.json";

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
