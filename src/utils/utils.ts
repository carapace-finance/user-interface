import { BigNumber } from "@ethersproject/bignumber";

export const SECONDS_PER_DAY = 86400;

export const formatAddress: Function = (address: string): string => {
  if (!address) return "";

  if (address.length < 10) {
    return address;
  }
  return address.slice(0, 4) + "..." + address.slice(-4);
};

export const getDaysInSeconds = (days) => {
  return BigNumber.from(days * SECONDS_PER_DAY);
};
