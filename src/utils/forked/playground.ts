import { formatEther, parseEther } from "@ethersproject/units";
import {
  transferUsdc,
  getUsdcContract,
  formatUSDC,
  parseUSDC
} from "@utils/usdc";
import { getDaysInSeconds } from "@utils/utils";
import {
  deleteFork,
  fillEther,
  moveForwardTime,
  sendTransaction
} from "./tenderly";
import { Playground } from "./types";
import { payToLendingPoolAddress } from "./goldfinch";

export async function preparePlayground(playground: Playground) {
  const { poolCycleManagerInstance, poolFactoryInstance, poolInstance } =
    playground.deployedContracts;
  console.log(
    "Preparing a playground with contracts: ",
    playground.deployedContracts
  );

  console.log("********** Pool Phase: OpenToSellers **********");
  console.log("********** Pool Cycle: 1, Day: 1     **********");

  const deployer = await playground.provider.getSigner(0);
  console.log("Deployer address: ", await deployer.getAddress());

  const user = playground.provider.getSigner(
    "0x008c84421da5527f462886cec43d2717b686a7e4"
  );
  await fillEther(await user.getAddress(), playground.provider);
  console.log("User address: ", await user.getAddress());

  // Deposit 1
  await transferApproveAndDeposit(
    playground.provider,
    poolInstance,
    parseUSDC("50000"),
    user
  );

  // Deposit 2
  await transferApproveAndDeposit(
    playground.provider,
    poolInstance,
    parseUSDC("51000"),
    user
  );

  console.log(
    "Pool's total sToken underlying: ",
    formatUSDC(await poolInstance.totalSTokenUnderlying())
  );
  console.log("Completed min capital requirement.");

  // move the pool to the next phase
  await poolInstance.connect(deployer).movePoolPhase();

  console.log("********** Pool Phase: OpenToBuyers **********");

  const lendingPoolAddress = "0xd09a57127bc40d680be7cb061c2a6629fe71abef";

  // buy protection 1
  await transferApproveAndBuyProtection(
    playground.provider,
    poolInstance,
    user,
    {
      lendingPoolAddress: lendingPoolAddress,
      nftLpTokenId: 590,
      protectionAmount: parseUSDC("150000"),
      protectionDurationInSeconds: getDaysInSeconds(30)
    }
  );

  console.log(
    "Pool leverage ratio: ",
    formatEther(await poolInstance.calculateLeverageRatio())
  );

  // move the pool to the next phase(Open)
  await poolInstance.connect(deployer).movePoolPhase();
  console.log(
    "Current Pool Phase: ",
    (await poolInstance.getPoolInfo()).currentPhase
  );

  console.log("********** Pool Phase: Open **********");

  // Withdrawal request 1: 10K sTokens
  // We are in cycle with index 0, so withdrawal index is 2
  const withdrawalCycleIndex = 2;
  await requestWithdrawal(
    poolInstance,
    user,
    parseEther("10000"),
    withdrawalCycleIndex
  );

  // Move pool to the next cycle (cycle 2)
  await movePoolCycle(
    playground.provider,
    poolInstance,
    poolCycleManagerInstance
  );

  console.log("********** Pool Cycle: 2, Day: 31     **********");

  // Deposit 3
  await transferApproveAndDeposit(
    playground.provider,
    poolInstance,
    parseUSDC("11000"),
    user
  );

  // Move pool to the next cycle (cycle 3)
  await movePoolCycle(
    playground.provider,
    poolInstance,
    poolCycleManagerInstance
  );

  console.log("********** Pool Cycle: 3, Day: 62     **********");

  // make payment to lending pool, so user can buy protection
  await payToLendingPoolAddress(
    lendingPoolAddress,
    "200000",
    playground.provider
  );

  console.log("Playground is ready!");
}

async function movePoolCycle(provider, poolInstance, poolCycleManagerInstance) {
  const poolInfo = await poolInstance.getPoolInfo();

  // move from open to locked state
  await moveForwardTime(provider, getDaysInSeconds(11));
  await poolCycleManagerInstance.calculateAndSetPoolCycleState(poolInfo.poolId);

  // move to new cycle
  await moveForwardTime(provider, getDaysInSeconds(20));
  await poolCycleManagerInstance.calculateAndSetPoolCycleState(poolInfo.poolId);
  console.log(
    "Pool Cycle:",
    await poolCycleManagerInstance.getCurrentPoolCycle(poolInfo.poolId)
  );
}

async function requestWithdrawal(
  poolInstance,
  user,
  sTokenAmt,
  withdrawalCycleIndex
) {
  await poolInstance.connect(user).requestWithdrawal(sTokenAmt);

  console.log(
    "User's requested withdrawal Amount: ",
    formatEther(
      await poolInstance
        .connect(user)
        .getRequestedWithdrawalAmount(withdrawalCycleIndex)
    )
  );
  console.log(
    "Total requested withdrawal amount: ",
    formatEther(
      await poolInstance.getTotalRequestedWithdrawalAmount(withdrawalCycleIndex)
    )
  );
}

export async function transferApproveAndDeposit(
  provider,
  poolInstance,
  depositAmt,
  receiver
) {
  const usdcContract = getUsdcContract(receiver);
  const receiverAddress = await receiver.getAddress();

  // transfer usdc to deployer
  await transferUsdc(provider, receiverAddress, depositAmt);

  // Approve & deposit 5K USDC
  await usdcContract.approve(poolInstance.address, depositAmt);
  return await poolInstance
    .connect(receiver)
    .deposit(depositAmt, receiverAddress);
}

export async function transferApproveAndBuyProtection(
  provider,
  poolInstance,
  buyer,
  purchaseParams
) {
  const usdcContract = getUsdcContract(buyer);

  console.log(
    "Total protection before buyProtection: ",
    formatUSDC(await poolInstance.totalProtection())
  );

  const buyerAddress = await buyer.getAddress();
  const premiumAmt = parseUSDC("5000");

  // transfer usdc to deployer
  await transferUsdc(provider, buyerAddress, premiumAmt);

  // Approve premium USDC
  await usdcContract.connect(buyer).approve(poolInstance.address, premiumAmt);

  console.log("Purchasing a protection using params: ", purchaseParams);

  return await poolInstance.connect(buyer).buyProtection(purchaseParams, {
    gasPrice: "259000000000",
    gasLimit: "210000000"
  });
}

const getLatestBlockTimestamp: Function = async (provider): Promise<number> => {
  return (await provider.getBlock("latest")).timestamp;
};

export async function resetPlayground(playground: Playground) {
  await playground.provider.send("evm_revert", [playground.snapshotId]);

  console.log(
    "Total capital: ",
    formatUSDC(
      await playground.deployedContracts.poolInstance.totalSTokenUnderlying()
    )
  );
  console.log(
    "Total protection: ",
    formatUSDC(
      await playground.deployedContracts.poolInstance.totalProtection()
    )
  );
}

export async function deletePlayground(
  forkId: string,
  tenderlyAccessKey: string
) {
  await deleteFork(forkId, tenderlyAccessKey);
}
