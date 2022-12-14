import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";

import {
  getPoolContract,
  getReferenceLendingPoolsContract
} from "@contracts/contractService";
import {
  transferApproveAndDeposit,
  transferApproveAndBuyProtection
} from "@utils/forked/playground";
import {
  LendingPool,
  ProtectionPurchase,
  ProtectionPurchaseParams
} from "@type/types";
import { convertUSDCToNumber, parseUSDC, USDC_FORMAT } from "@utils/usdc";
import numeral from "numeral";

export class ProtectionPoolService {
  private protectionPurchaseByLendingPool: Map<string, BigNumber>;
  private lastActionTimestamp: number;

  constructor(
    public readonly provider: JsonRpcProvider,
    public readonly isPlayground: boolean
  ) {
    this.provider = provider;
    this.isPlayground = isPlayground;

    // TODO: need to get this from the contract
    this.protectionPurchaseByLendingPool = new Map();
    this.protectionPurchaseByLendingPool.set(
      "0xd09a57127bc40d680be7cb061c2a6629fe71abef",
      parseUSDC("150000")
    );
  }

  // TODO: remove this function and its usage, once we have this data from the contract
  public updateProtectionPurchaseByLendingPool(
    lendingPoolAddress: string,
    purchaseAmt: BigNumber
  ) {
    this.protectionPurchaseByLendingPool.set(
      lendingPoolAddress.toLowerCase(),
      purchaseAmt
    );
  }

  public getProtectionPurchaseByLendingPool(lendingPoolAddress: string) {
    return this.protectionPurchaseByLendingPool.get(lendingPoolAddress);
  }

  public async deposit(poolAddress: string, depositAmt: BigNumber) {
    this.lastActionTimestamp = Date.now();

    const signer = this.provider.getSigner();
    const poolInstance = getPoolContract(poolAddress, signer);
    if (this.isPlayground) {
      return await transferApproveAndDeposit(
        this.provider,
        poolInstance,
        depositAmt,
        signer
      );
    } else {
      return await poolInstance.deposit(depositAmt, await signer.getAddress());
    }
  }

  public async requestWithdrawal(poolAddress: string, usdcAmt: BigNumber) {
    this.lastActionTimestamp = Date.now();

    const signer = this.provider.getSigner();
    const poolInstance = getPoolContract(poolAddress, signer);
    const sTokenAmt = await poolInstance.convertToSToken(usdcAmt);

    console.log("Requesting to withdraw sTokenAmt: ", sTokenAmt.toString());
    return await poolInstance.requestWithdrawal(sTokenAmt, {
      gasPrice: "259000000000",
      gasLimit: "210000000"
    });
  }

  public async buyProtection(
    poolAddress: string,
    purchaseParams: ProtectionPurchaseParams
  ) {
    this.lastActionTimestamp = Date.now();
    const poolInstance = getPoolContract(
      poolAddress,
      this.provider.getSigner()
    );

    if (this.isPlayground) {
      // buyer with lending position in goldfinch
      const buyer = this.provider.getSigner(
        "0x008c84421da5527f462886cec43d2717b686a7e4"
      );
      return await transferApproveAndBuyProtection(
        this.provider,
        poolInstance,
        buyer,
        purchaseParams
      );
    } else {
      return await poolInstance.buyProtection(purchaseParams);
    }
  }

  /**
   * Sends withdrawal transaction to the pool contract with specified amount with receiver as signed user.
   * @param poolAddress
   * @param usdcAmt
   * @returns
   */
  public async withdraw(poolAddress: string, usdcAmt: BigNumber) {
    this.lastActionTimestamp = Date.now();

    const signer = this.provider.getSigner();
    const poolInstance = getPoolContract(poolAddress, signer);
    const sTokenAmt = await poolInstance.convertToSToken(usdcAmt);

    console.log("Withdrawing sTokenAmt: ", sTokenAmt.toString());
    return await poolInstance.withdraw(sTokenAmt, signer.getAddress(), {
      gasPrice: "259000000000",
      gasLimit: "210000000"
    });
  }

  /**
   * Provides USDC balance of signed user in the pool.
   * @param poolAddress
   * @returns
   */
  public async getSTokenUnderlyingBalance(poolAddress: string) {
    const poolInstance = getPoolContract(
      poolAddress,
      this.provider.getSigner()
    );
    const sTokenBalance = await poolInstance.balanceOf(
      await this.provider.getSigner().getAddress()
    );
    const usdcBalance = await poolInstance.convertToUnderlying(sTokenBalance);
    return usdcBalance;
  }

  /**
   * Provides requested withdrawal amount in USDC for a signed user in the pool for current pool cycle.
   * @param poolAddress
   * @returns
   */
  public async getRequestedWithdrawalAmount(poolAddress: string) {
    const poolInstance = getPoolContract(
      poolAddress,
      this.provider.getSigner()
    );

    // TODO: use the new contract method to get the requested withdrawal amount for current cycle
    const withdrawalCycleIndex = 2;
    const sTokenBalance = await poolInstance.getRequestedWithdrawalAmount(
      withdrawalCycleIndex
    );
    const usdcBalance = await poolInstance.convertToUnderlying(sTokenBalance);
    return usdcBalance;
  }

  /**
   * Provides all lending pools for a given protection pool.
   * @param poolAddress
   * @returns
   */
  public async getLendingPools(poolAddress: string): Promise<LendingPool[]> {
    const user = this.provider.getSigner();
    const pool = getPoolContract(poolAddress, user);
    const poolInfo = await pool.getPoolInfo();
    console.log("Retrieved Pool Info: ", poolInfo);
    const referenceLendingPoolsContract = getReferenceLendingPoolsContract(
      poolInfo.referenceLendingPools,
      user
    );

    return referenceLendingPoolsContract
      .getLendingPools()
      .then((lendingPools) =>
        lendingPools.map((lendingPool) => {
          console.log("lendingPool: ", lendingPool);
          const protectionPurchase = this.getProtectionPurchaseByLendingPool(
            lendingPool.toLowerCase()
          );

          console.log(
            "protectionPurchaseByLendingPool: ",
            this.protectionPurchaseByLendingPool
          );

          return {
            address: lendingPool,
            name: "Lend East #1: Emerging Asia Fintech Pool",
            protocol: "goldfinch",
            adjustedYields: "7 - 10%",
            lendingPoolAPY: "17%",
            CARATokenRewards: "~3.5%",
            premium: "4 - 7%",
            timeLeft: "59 Days 8 Hours 2 Mins",
            protectionPoolAddress: poolAddress,
            protectionPurchase: protectionPurchase
              ? numeral(convertUSDCToNumber(protectionPurchase)).format(
                  USDC_FORMAT
                ) + " USDC"
              : "-"
          };
        })
      );
  }

  public async calculatePremiumPrice(
    poolAddress: string,
    purchaseParams: ProtectionPurchaseParams
  ): Promise<BigNumber> {
    return Promise.resolve(parseUSDC("1024"));
  }

  public async getProtectionPurchases(
    poolAddress: string
  ): Promise<ProtectionPurchase[]> {
    return Promise.resolve([]);
  }

  public getLastActionTimestamp(): number {
    return this.lastActionTimestamp || 0;
  }
}
