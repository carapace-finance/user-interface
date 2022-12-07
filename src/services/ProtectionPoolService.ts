import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";

import { getPoolContract } from "@contracts/contractService";
import {
  transferApproveAndDeposit,
  transferApproveAndBuyProtection
} from "@utils/forked/playground";
import { ProtectionPurchaseParams } from "@type/types";

export class ProtectionPoolService {
  constructor(
    private readonly provider: JsonRpcProvider,
    public readonly isPlayground: boolean
  ) {
    this.provider = provider;
    this.isPlayground = isPlayground;
  }

  public async deposit(poolAddress: string, depositAmt: BigNumber) {
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

  public async withdraw(poolAddress: string, usdcAmt: BigNumber) {}

  public async getBalance(poolAddress: string) {
    const poolInstance = getPoolContract(
      poolAddress,
      this.provider.getSigner()
    );
    const balance = await poolInstance.balanceOf(
      await this.provider.getSigner().getAddress()
    );
    return balance;
  }
}
