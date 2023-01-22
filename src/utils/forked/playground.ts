import { formatEther, parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import {
  transferUsdc,
  getUsdcContract,
  formatUSDC,
  parseUSDC
} from "@utils/usdc";
import { formatAddress, getDaysInSeconds } from "@utils/utils";
import { deleteFork, fillEther, moveForwardTime } from "./tenderly";
import { Playground } from "./types";
import { payToLendingPoolAddress } from "./goldfinch";
import {
  GOLDFINCH_LENDING_POOLS,
  PLAYGROUND_LENDING_POOL_DETAILS_BY_ADDRESS
} from "./deploy";
import { protocolParameters } from "../../constants";

export function getLendingPoolName(lendingPoolAddress: string): string {
  const lendingPoolDetails =
    PLAYGROUND_LENDING_POOL_DETAILS_BY_ADDRESS[
      lendingPoolAddress.toLowerCase()
    ];

  return (
    lendingPoolDetails?.name ||
    `Goldfinch Lending Pool - ${formatAddress(lendingPoolAddress)}`
  );
}

export async function preparePlayground(playground: Playground) {
  const {
    poolCycleManagerInstance,
    poolFactoryInstance,
    protectionPoolInstance
  } = playground.deployedContracts;
  console.log("Preparing a playground: ", playground.forkId);

  // Setup deployer account
  const deployer = await playground.provider.getSigner(0);
  const deployerAddress = await deployer.getAddress();
  console.log("Deployer address: ", deployerAddress);
  // transfer usdc to deployer
  await transferUsdc(playground.provider, deployerAddress, parseUSDC("100000")); // 100K USDC

  // Setup another user account
  const userAddress = "0x008c84421da5527f462886cec43d2717b686a7e4";
  const user = playground.provider.getSigner(userAddress);
  console.log("User address: ", userAddress);
  await fillEther(userAddress, playground.provider);
  // transfer usdc to user
  await transferUsdc(playground.provider, userAddress, parseUSDC("100000")); // 100K USDC

  console.log("********** Pool Phase: OpenToSellers **********");
  console.log("********** Pool Cycle: 1, Day: 1     **********");

  // Deposit 1 by user
  await approveAndDeposit(protectionPoolInstance, parseUSDC("50000"), user);

  // Deposit 2 by deployer
  await approveAndDeposit(protectionPoolInstance, parseUSDC("51000"), deployer);

  console.log(
    "Pool's total sToken underlying: ",
    formatUSDC(await protectionPoolInstance.totalSTokenUnderlying())
  );
  console.log("Completed min capital requirement.");

  // move the pool to the next phase
  await protectionPoolInstance.connect(deployer).movePoolPhase();

  console.log("********** Pool Phase: OpenToBuyers **********");

  const lendingPoolAddress = GOLDFINCH_LENDING_POOLS[0];

  // buy protection 1
  await transferApproveAndBuyProtection(
    playground.provider,
    protectionPoolInstance,
    {
      lendingPoolAddress: lendingPoolAddress,
      nftLpTokenId: 590,
      protectionAmount: parseUSDC("150000"),
      protectionDurationInSeconds: getDaysInSeconds(protocolParameters.minProtectionDurationInDays)
    },
    parseUSDC("3500")
  );

  console.log(
    "Pool leverage ratio: ",
    formatEther(await protectionPoolInstance.calculateLeverageRatio())
  );

  // move the pool to the next phase(Open)
  await protectionPoolInstance.connect(deployer).movePoolPhase();
  console.log(
    "Current Pool Phase: ",
    (await protectionPoolInstance.getPoolInfo()).currentPhase
  );

  console.log("********** Pool Phase: Open **********");

  // Withdrawal request 1: 10K sTokens for deployer
  // We are in cycle with index 0, so withdrawal index is 2
  const withdrawalCycleIndex = 2;
  await requestWithdrawal(
    protectionPoolInstance,
    deployer,
    parseEther("10000"),
    withdrawalCycleIndex
  );

  // Move pool to the next cycle (cycle 2)
  await movePoolCycle(
    playground.provider,
    protectionPoolInstance,
    poolCycleManagerInstance
  );

  console.log("********** Pool Cycle: 2, Day: 31     **********");

  // Deposit 3
  await approveAndDeposit(protectionPoolInstance, parseUSDC("11000"), user);

  // Move pool to the next cycle (cycle 3)
  await movePoolCycle(
    playground.provider,
    protectionPoolInstance,
    poolCycleManagerInstance
  );

  console.log("********** Pool Cycle: 3, Day: 62     **********");

  // make payment to all playground lending pools for 3 months, so user can buy protections for them
  for (let i = 0; i < GOLDFINCH_LENDING_POOLS.length; i++) {
    const lendingPoolAddress = GOLDFINCH_LENDING_POOLS[i];
    await payToLendingPoolAddress(
      lendingPoolAddress,
      "900000",
      playground.provider
    );
    console.log("Payment made to lending pool: ", lendingPoolAddress);
  }

  console.log("Playground is ready!");
}

async function movePoolCycle(
  provider,
  protectionPoolInstance,
  poolCycleManagerInstance
) {
  const protectionPoolInfo = await protectionPoolInstance.getPoolInfo();

  // move from open to locked state
  await moveForwardTime(provider, getDaysInSeconds(protocolParameters.openCycleDurationInDays + 1));
  await poolCycleManagerInstance.calculateAndSetPoolCycleState(
    protectionPoolInfo.poolId
  );

  // move to new cycle
  await moveForwardTime(provider, getDaysInSeconds(protocolParameters.cycleDurationInDays - protocolParameters.openCycleDurationInDays));
  await poolCycleManagerInstance.calculateAndSetPoolCycleState(
    protectionPoolInfo.poolId
  );
  console.log(
    "Pool Cycle:",
    await poolCycleManagerInstance.getCurrentPoolCycle(
      protectionPoolInfo.poolId
    )
  );
}

async function requestWithdrawal(
  protectionPoolInstance,
  user,
  sTokenAmt,
  withdrawalCycleIndex
) {
  await protectionPoolInstance.connect(user).requestWithdrawal(sTokenAmt);

  // console.log(
  //   "User's requested withdrawal Amount: ",
  //   formatEther(
  //     await protectionPoolInstance
  //       .connect(user)
  //       .getRequestedWithdrawalAmount(withdrawalCycleIndex)
  //   )
  // );
  // console.log(
  //   "Total requested withdrawal amount: ",
  //   formatEther(
  //     await protectionPoolInstance.getTotalRequestedWithdrawalAmount(
  //       withdrawalCycleIndex
  //     )
  //   )
  // );
}

export async function approveAndDeposit(
  protectionPoolInstance,
  depositAmt,
  receiver
) {
  const usdcContract = getUsdcContract(receiver);
  const receiverAddress = await receiver.getAddress();

  // transfer usdc to receiver
  // await transferUsdc(provider, receiverAddress, depositAmt);

  // Approve & deposit
  await usdcContract.approve(protectionPoolInstance.address, depositAmt, {
    gasPrice: "25900000000",
    gasLimit: "200000"
  });
  return await protectionPoolInstance
    .connect(receiver)
    .deposit(depositAmt, receiverAddress);
}

export async function transferApproveAndBuyProtection(
  provider,
  protectionPoolInstance,
  purchaseParams,
  maxPremiumAmt
) {
  // Update purchase params based on lending pool details
  const lendingPoolDetails =
    PLAYGROUND_LENDING_POOL_DETAILS_BY_ADDRESS[
      purchaseParams.lendingPoolAddress.toLowerCase()
    ];
  const buyer = provider.getSigner(lendingPoolDetails.lendingPosition.owner);
  await fillEther(await buyer.getAddress(), provider);
  console.log("Buyer eth balance: ", formatEther(await buyer.getBalance()));
  purchaseParams.nftLpTokenId = lendingPoolDetails.lendingPosition.tokenId;

  const usdcContract = getUsdcContract(buyer);

  console.log(
    "Total protection before buyProtection: ",
    formatUSDC(await protectionPoolInstance.totalProtection())
  );

  console.log(
    "Using Lending pool position: ",
    lendingPoolDetails.lendingPosition
  );

  const buyerAddress = await buyer.getAddress();

  // transfer usdc to buyer, the lending position owner
  await transferUsdc(provider, buyerAddress, maxPremiumAmt);

  // Approve premium USDC
  // todo: approve the exact premiumAmt after the buyProtection method with the premiumAmt argument is implemented
  await usdcContract
    .connect(buyer)
    .approve(protectionPoolInstance.address, maxPremiumAmt);

  console.log("Purchasing a protection using params: ", purchaseParams);

  return await protectionPoolInstance
    .connect(buyer)
    .buyProtection(purchaseParams, maxPremiumAmt, {
      gasPrice: "25900000000",
      gasLimit: "210000000"
    });
}

const getLatestBlockTimestamp: Function = async (provider): Promise<number> => {
  return (await provider.getBlock("latest")).timestamp;
};

export async function deletePlayground(
  forkId: string,
  tenderlyAccessKey: string
) {
  await deleteFork(forkId, tenderlyAccessKey);
}
