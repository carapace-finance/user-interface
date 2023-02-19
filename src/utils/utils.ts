import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { USDC_NUM_OF_DECIMALS } from "./usdc";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const scale18DecimalsAmtToUsdcDecimals = (amt: BigNumber) => {
  return amt.div(BigNumber.from(10).pow(18 - USDC_NUM_OF_DECIMALS));
};

export const scaleUsdcAmtTo18Decimals = (usdcAmt: BigNumber) => {
  return usdcAmt.mul(BigNumber.from(10).pow(18 - USDC_NUM_OF_DECIMALS));
};

export const shortAddress = (
  address: string | undefined,
  pre: number = 5,
  post: number = 4
): string => {
  return !!address
    ? `${address.substring(0, pre)}...${address.substring(
        address.length - post,
        address.length
      )}`
    : "";
};

export const getDecimalMul = (
  val: string | BigNumber,
  decimals: number
): BigNumber => BigNumber.from(val).mul(BigNumber.from(10).pow(decimals));

export const getDecimalMulString = (
  val: string | BigNumber,
  decimals: number
): string => getDecimalMul(val, decimals).toString();

export const getDecimalMulFormatted = (val: BigNumber, decimals: number) =>
  getDecimalMul(val, decimals).toBigInt().toLocaleString();

export const getDecimalDiv = (
  val: string | BigNumber,
  decimals: number
): BigNumber => BigNumber.from(val).div(BigNumber.from(10).pow(decimals));

export const getDecimalDivString = (
  val: string | BigNumber,
  decimals: number
): string => getDecimalDivString(val, decimals).toString();

export const getDecimalDivFormatted = (
  val: string | BigNumber,
  decimals: number
): string => getDecimalDiv(val, decimals).toBigInt().toLocaleString();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
