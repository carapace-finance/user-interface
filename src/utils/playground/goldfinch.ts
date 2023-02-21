import { JsonRpcProvider } from "@ethersproject/providers";
import {
  getCreditLineContract,
  getTranchedPoolContract
} from "../../contracts/contractService";
import { parseUSDC, transferUsdc } from "../usdc";

export const payToLendingPoolAddress: Function = async (
  tranchedPoolAddress: string,
  amount: string,
  provider: JsonRpcProvider
) => {
  const tranchedPool = getTranchedPoolContract(
    tranchedPoolAddress,
    provider.getSigner()
  );

  const amountToPay = parseUSDC(amount);

  // Transfer USDC to lending pool's credit line
  await transferUsdc(provider, await tranchedPool.creditLine(), amountToPay);

  // assess lending pool
  await tranchedPool.assess();
};

export const isLendingPoolLate: Function = async (
  tranchedPoolAddress: string,
  provider: JsonRpcProvider
) => {
  const tranchedPool = getTranchedPoolContract(
    tranchedPoolAddress,
    provider.getSigner()
  );
  const creditLine = getCreditLineContract(
    await tranchedPool.creditLine(),
    provider.getSigner()
  );

  return await creditLine.isLate();
};
