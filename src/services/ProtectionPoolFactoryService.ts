import { JsonRpcProvider } from "@ethersproject/providers";

import {
  getPoolFactoryContract,
  getPoolContract
} from "@contracts/contractService";
import {
  convertUSDCToNumber,
  USDC_FORMAT,
  USDC_NUM_OF_DECIMALS
} from "@utils/usdc";
import numeral from "numeral";
import { ProtectionPool } from "@type/types";
import assets from "../assets";
import { scale18DecimalsAmtToUsdcDecimals } from "@utils/utils";
const goldfinchLogo = assets.goldfinch.src;

export class ProtectionPoolFactoryService {
  constructor(
    private readonly provider: JsonRpcProvider,
    public readonly isPlayground: boolean,
    private readonly poolFactoryAddress: string
  ) {
    this.provider = provider;
    this.isPlayground = isPlayground;
    this, (poolFactoryAddress = poolFactoryAddress);
  }

  public async getProtectionPools(): Promise<ProtectionPool[]> {
    const signer = this.provider.getSigner();
    const poolFactoryInstance = getPoolFactoryContract(
      this.poolFactoryAddress,
      signer
    );
    return await poolFactoryInstance
      .getPoolAddress(1)
      .then(async (poolAddress) => {
        const pool = getPoolContract(poolAddress, this.provider.getSigner());
        const poolInfo = await pool.getPoolInfo();

        // Convert leverageRatio floor  & ceiling to from 18 to 6 (USDC decimals)
        const leverageRatioFloor = scale18DecimalsAmtToUsdcDecimals(
          poolInfo.params.leverageRatioFloor
        );
        const leverageRatioCeiling = scale18DecimalsAmtToUsdcDecimals(
          poolInfo.params.leverageRatioCeiling
        );
        return pool.totalProtection().then((totalProtection) => {
          return pool.totalSTokenUnderlying().then((totalCapital) => {
            // no need to scale down purchase limit to 6 (USDC decimals) because of division
            const purchaseLimit = totalCapital.div(leverageRatioFloor);
            // need to scale down deposit limit to 6 (USDC decimals) because of multiplication
            const depositLimit = totalProtection
              .mul(leverageRatioCeiling)
              .div(10 ** USDC_NUM_OF_DECIMALS);
            return [
              {
                address: poolAddress,
                protocols: goldfinchLogo,
                APY: "8 - 15%",
                totalCapital:
                  numeral(convertUSDCToNumber(totalCapital)).format(
                    USDC_FORMAT
                  ) + " USDC",
                totalProtection:
                  numeral(convertUSDCToNumber(totalProtection)).format(
                    USDC_FORMAT
                  ) + " USDC",
                protectionPurchaseLimit:
                  numeral(purchaseLimit).format(USDC_FORMAT) + " USDC",
                depositLimit:
                  numeral(convertUSDCToNumber(depositLimit)).format(
                    USDC_FORMAT
                  ) + " USDC"
              }
            ];
          });
        });
      });
  }
}
