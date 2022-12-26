import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";

import {
  getProtectionPoolContract,
  getPremiumCalculatorContract,
  getReferenceLendingPoolsContract
} from "@contracts/contractService";
import {
  approveAndDeposit,
  transferApproveAndBuyProtection,
  getLendingPoolName
} from "@utils/forked/playground";
import {
  LendingPool,
  ProtectionInfo,
  ProtectionPurchaseParams
} from "@type/types";
import { convertUSDCToNumber, parseUSDC, USDC_FORMAT } from "@utils/usdc";
import numeral from "numeral";
import {
  scale18DecimalsAmtToUsdcDecimals,
  scaleUsdcAmtTo18Decimals
} from "@utils/utils";

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

  public async deposit(protectionPoolAddress: string, depositAmt: BigNumber) {
    this.setLastActionTimestamp();

    const signer = this.provider.getSigner();
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      signer
    );
    if (this.isPlayground) {
      return await approveAndDeposit(
        protectionPoolInstance,
        depositAmt,
        signer
      );
    } else {
      return await protectionPoolInstance.deposit(
        depositAmt,
        await signer.getAddress()
      );
    }
  }

  public async requestWithdrawal(
    protectionPoolAddress: string,
    usdcAmt: BigNumber
  ) {
    this.setLastActionTimestamp();

    const signer = this.provider.getSigner();
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      signer
    );
    const sTokenAmt = await protectionPoolInstance.convertToSToken(usdcAmt);

    console.log("Requesting to withdraw sTokenAmt: ", sTokenAmt.toString());
    return await protectionPoolInstance.requestWithdrawal(sTokenAmt, {
      gasPrice: "25900000000",
      gasLimit: "210000000"
    });
  }

  public async buyProtection(
    protectionPoolAddress: string,
    purchaseParams: ProtectionPurchaseParams,
    premiumAmt: BigNumber
  ) {
    this.setLastActionTimestamp();
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      this.provider.getSigner()
    );

    // todo: approve the exact premiumAmt after the buyProtection method with the premiumAmt argument is implemented
    if (this.isPlayground) {
      return await transferApproveAndBuyProtection(
        this.provider,
        protectionPoolInstance,
        purchaseParams,
        new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "16")
      );
    } else {
      return await protectionPoolInstance.buyProtection(purchaseParams);
    }
  }

  /**
   * Sends withdrawal transaction to the pool contract with specified amount with receiver as signed user.
   * @param protectionPoolAddress
   * @param usdcAmt
   * @returns
   */
  public async withdraw(protectionPoolAddress: string, usdcAmt: BigNumber) {
    this.setLastActionTimestamp();

    const signer = this.provider.getSigner();
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      signer
    );
    const sTokenAmt = await protectionPoolInstance.convertToSToken(usdcAmt);

    console.log("Withdrawing sTokenAmt: ", sTokenAmt.toString());
    return await protectionPoolInstance.withdraw(
      sTokenAmt,
      signer.getAddress(),
      {
        gasPrice: "25900000000",
        gasLimit: "210000000"
      }
    );
  }

  /**
   * Provides USDC balance of signed user in the pool.
   * @param protectionPoolAddress
   * @returns
   */
  public async getSTokenUnderlyingBalance(protectionPoolAddress: string) {
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      this.provider.getSigner()
    );
    const sTokenBalance = await protectionPoolInstance.balanceOf(
      await this.provider.getSigner().getAddress()
    );
    const usdcBalance = await protectionPoolInstance.convertToUnderlying(
      sTokenBalance
    );
    return usdcBalance;
  }

  /**
   * Provides requested withdrawal amount in USDC for a signed user in the pool for current pool cycle.
   * @param protectionPoolAddress
   * @returns
   */
  public async getRequestedWithdrawalAmount(protectionPoolAddress: string) {
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      this.provider.getSigner()
    );

    // TODO: use the new contract method to get the requested withdrawal amount for current cycle
    const withdrawalCycleIndex = 2;
    const sTokenBalance =
      await protectionPoolInstance.getRequestedWithdrawalAmount(
        withdrawalCycleIndex
      );
    const usdcAmount = await protectionPoolInstance.convertToUnderlying(
      sTokenBalance
    );
    return usdcAmount;
  }

  /**
   * Provides all lending pools for a given protection pool.
   * @param protectionPoolAddress
   * @returns
   */
  public async getLendingPools(
    protectionPoolAddress: string
  ): Promise<LendingPool[]> {
    const user = this.provider.getSigner();
    const protectionPool = getProtectionPoolContract(
      protectionPoolAddress,
      user
    );
    const poolInfo = await protectionPool.getPoolInfo();
    console.log("Retrieved Pool Info: ", poolInfo);
    const referenceLendingPoolsContract = getReferenceLendingPoolsContract(
      poolInfo.referenceLendingPools,
      user
    );

    return referenceLendingPoolsContract
      .getLendingPools()
      .then((lendingPools) =>
        lendingPools.map((lendingPool) => {
          const protectionPurchase = this.getProtectionPurchaseByLendingPool(
            lendingPool.toLowerCase()
          );

          console.log(
            "protectionPurchaseByLendingPool: ",
            this.protectionPurchaseByLendingPool
          );

          return {
            address: lendingPool,
            name: getLendingPoolName(lendingPool),
            protocol: "goldfinch",
            adjustedYields: "7 - 10%",
            lendingPoolAPY: "17%",
            CARATokenRewards: "~3.5%",
            premium: "4 - 7%",
            timeLeft: "59 Days 8 Hours 2 Mins",
            protectionPoolAddress: protectionPoolAddress,
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
    protectionPoolAddress: string,
    premiumCalculatorAddress: string,
    purchaseParams: ProtectionPurchaseParams
  ): Promise<BigNumber> {
    console.log("calculating premium price: ", purchaseParams);
    const user = this.provider.getSigner();
    const protectionPool = getProtectionPoolContract(
      protectionPoolAddress,
      user
    );
    const poolInfo = await protectionPool.getPoolInfo();
    const referenceLendingPools = getReferenceLendingPoolsContract(
      poolInfo.referenceLendingPools,
      user
    );
    const premiumCalculator = getPremiumCalculatorContract(
      premiumCalculatorAddress,
      user
    );
    const buyerApy: BigNumber =
      await referenceLendingPools.calculateProtectionBuyerAPR(
        purchaseParams.lendingPoolAddress
      );

    return premiumCalculator
      .calculatePremium(
        purchaseParams.protectionDurationInSeconds,
        scaleUsdcAmtTo18Decimals(purchaseParams.protectionAmount),
        buyerApy,
        await protectionPool.calculateLeverageRatio(),
        await protectionPool.totalSTokenUnderlying(),
        poolInfo.params
      )
      .then((result) => {
        console.log("calculatePremiumPrice result: ", result);
        return scale18DecimalsAmtToUsdcDecimals(result[0]);
      });
  }

  // todo: this needs to be rewritten in the mainnet
  // todo: we don't check users as another address buys protection on behalf of the this.provider.getSigner().getAddress()
  public async getProtectionPurchases(
    protectionPoolAddress: string
  ): Promise<ProtectionInfo[]> {
    const protectionPoolInstance = getProtectionPoolContract(
      protectionPoolAddress,
      await this.provider.getSigner()
    );
    let activeProtections1 = await protectionPoolInstance.getActiveProtections(
      "0x4902b20bb3b8e7776cbcdcb6e3397e7f6b4e449e"
    );
    let activeProtections2 = await protectionPoolInstance.getActiveProtections(
      "0x008c84421da5527f462886cec43d2717b686a7e4"
    );
    let activeProtections3 = await protectionPoolInstance.getActiveProtections(
      "0x3371E5ff5aE3f1979074bE4c5828E71dF51d299c"
    );
    let activeProtections4 = await protectionPoolInstance.getActiveProtections(
      await this.provider.getSigner().getAddress()
    );
    let activeProtections = [
      ...activeProtections1,
      ...activeProtections2,
      ...activeProtections3,
      ...activeProtections4
    ];
    console.log("activeProtections ==>", activeProtections);

    if (activeProtections) {
      return activeProtections;
    } else {
      return;
    }
  }

  public setLastActionTimestamp(): number {
    this.lastActionTimestamp = Date.now();
    console.log(
      "setting up the last action timestamp... ==>",
      this.lastActionTimestamp
    );
    return this.lastActionTimestamp;
  }

  public getLastActionTimestamp(): number {
    return this.lastActionTimestamp || 0;
  }
}
