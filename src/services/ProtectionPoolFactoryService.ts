import { JsonRpcProvider } from "@ethersproject/providers";

import {
  getPoolFactoryContract,
  getPoolContract
} from "@contracts/contractService";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import numeral from "numeral";
import { ProtectionPool } from "@type/types";
import assets from "../assets";
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
        return pool.totalProtection().then((totalProtection) => {
          return pool.totalSTokenUnderlying().then((totalCapital) => {
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
                  ) + " USDC"
              }
            ];
          });
        });
      });
  }
}
