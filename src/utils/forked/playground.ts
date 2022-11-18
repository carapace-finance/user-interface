import { formatEther, parseEther } from "@ethersproject/units";
import {
  transferUsdc,
  getUsdcContract,
  formatUSDC,
  parseUSDC
} from "@utils/usdc";
import { sendTransaction } from "./tenderly";
import { Playground } from "./types";

export async function preparePlayground(playground: Playground) {
  const { poolCycleManagerInstance, poolFactoryInstance, poolInstance } =
    playground.deployedContracts;
  console.log(
    "preparing a playground with contracts: ",
    playground.deployedContracts
  );

  // const poolInfo = await poolInstance.getPoolInfo();
  // console.log("Pool Info: ", poolInfo);

  // console.log(
  //   "Current pool cycle: ",
  //   await poolCycleManagerInstance.getCurrentPoolCycle(poolInfo.poolId)
  // );

  const deployer = await playground.provider.getSigner(0);
  const deployerAddress = await deployer.getAddress();
  console.log("Deployer address: ", deployerAddress);

  const seller1 = await playground.provider.getSigner(1);
  const buyer1 = await playground.provider.getSigner(2);
  const usdcContract = getUsdcContract(deployer);

  await transferApproveAndDeposit(
    usdcContract,
    playground.provider,
    poolInstance,
    deployer
  );

  console.log(
    "Pool's total sToken underlying: ",
    formatUSDC(await poolInstance.totalSTokenUnderlying())
  );

  // buy protection for buyer1
  console.log("Buyer1 buys protection...");
  await transferApproveAndBuyProtection(
    usdcContract,
    playground.provider,
    poolInstance,
    buyer1
  );
}

async function transferApproveAndDeposit(
  usdcContract,
  provider,
  poolInstance,
  receiver
) {
  const receiverAddress = await receiver.getAddress();
  const depositAmt = parseUSDC("5000");

  console.log(
    "Receiver's USDC balance before: ",
    formatUSDC(await usdcContract.balanceOf(receiverAddress))
  );
  // transfer usdc to deployer
  await transferUsdc(provider, receiverAddress, depositAmt);
  console.log(
    "Receiver's USDC balance after: ",
    formatUSDC(await usdcContract.balanceOf(receiverAddress))
  );

  console.log(
    "Receiver's sToken bal before: ",
    formatEther(await poolInstance.balanceOf(receiverAddress))
  );

  // Approve & deposit 5K USDC
  await usdcContract.approve(poolInstance.address, depositAmt);
  await poolInstance.connect(receiver).deposit(depositAmt, receiverAddress);
  console.log(
    "Receiver's sToken bal after: ",
    formatEther(await poolInstance.balanceOf(receiverAddress))
  );

  console.log(
    "Receiver's USDC balance after deposit: ",
    formatUSDC(await usdcContract.balanceOf(receiverAddress))
  );
}

async function transferApproveAndBuyProtection(
  usdcContract,
  provider,
  poolInstance,
  buyer
) {
  console.log(
    "Total protection before buyProtection: ",
    formatUSDC(await poolInstance.totalProtection())
  );

  const buyerAddress = await buyer.getAddress();
  const premiumAmt = parseUSDC("5000");

  // transfer usdc to deployer
  await transferUsdc(provider, buyerAddress, premiumAmt);

  // Approve premium USDC
  await usdcContract.approve(poolInstance.address, premiumAmt);

  // Buy protection
  const purchaseParams = {
    lendingPoolAddress: "0xd09a57127bc40d680be7cb061c2a6629fe71abef",
    nftLpTokenId: 590,
    protectionAmount: parseUSDC("100000"),
    protectionExpirationTimestamp:
      (await getLatestBlockTimestamp(provider)) + 86400 * 30 // 30 days
  };
  // await poolInstance
  //   .connect(provider.getSigner("0x008c84421da5527f462886cec43d2717b686a7e4"))
  //   .buyProtection(purchaseParams);

  await sendTransaction(
    provider,
    "0x008c84421da5527f462886cec43d2717b686a7e4",
    poolInstance,
    "buyProtection",
    purchaseParams
  );

  console.log(
    "Total protection after buyProtection: ",
    formatUSDC(await poolInstance.totalProtection())
  );
}

const getLatestBlockTimestamp: Function = async (provider): Promise<number> => {
  return (await provider.getBlock("latest")).timestamp;
};
