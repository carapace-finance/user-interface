import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";

import { getPoolContract } from "@contracts/contractService";
import { transferApproveAndDeposit } from "@utils/forked/playground";

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

  public withdraw(amount: number) {}

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
