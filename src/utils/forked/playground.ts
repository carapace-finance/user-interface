import { formatEther, parseEther } from "@ethersproject/units";
import {
  transferUsdc,
  getUsdcContract,
  formatUSDC,
  parseUSDC
} from "@utils/usdc";
import { deleteFork, fillEther, sendTransaction } from "./tenderly";
import { Playground } from "./types";

export async function preparePlayground(playground: Playground) {
  const { poolCycleManagerInstance, poolFactoryInstance, poolInstance } =
    playground.deployedContracts;
  console.log(
    "preparing a playground with contracts: ",
    playground.deployedContracts
  );

  const deployer = await playground.provider.getSigner(0);

  await transferApproveAndDeposit(
    playground.provider,
    poolInstance,
    parseUSDC("5000"),
    deployer
  );
  console.log("Starting deposit...");
  console.log(
    "Pool's total sToken underlying: ",
    formatUSDC(await poolInstance.totalSTokenUnderlying())
  );

  // buy protection
  const protectionBuyer1 = playground.provider.getSigner(
    "0x008c84421da5527f462886cec43d2717b686a7e4"
  );
  await fillEther(await protectionBuyer1.getAddress(), playground.provider);

  await transferApproveAndBuyProtection(
    playground.provider,
    poolInstance,
    protectionBuyer1,
    "0xd09a57127bc40d680be7cb061c2a6629fe71abef",
    590,
    parseUSDC("100000"),
    30
  );

  console.log(
    "Pool leverage ratio: ",
    formatEther(await poolInstance.calculateLeverageRatio())
  );

  console.log("Playground run completed!");
}

export async function transferApproveAndDeposit(
  provider,
  poolInstance,
  depositAmt,
  receiver
) {
  const usdcContract = getUsdcContract(receiver);
  const receiverAddress = await receiver.getAddress();

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

  console.log("Finished deposit");
}

export async function transferApproveAndBuyProtection(
  provider,
  poolInstance,
  buyer,
  lendingPoolAddress,
  nftLpTokenId,
  protectionAmount,
  protectionDurationInDays
) {
  const usdcContract = getUsdcContract(buyer);
  console.log("Starting buyProtection...");
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

  // Buy protection
  const purchaseParams = {
    lendingPoolAddress: lendingPoolAddress,
    nftLpTokenId: nftLpTokenId,
    protectionAmount: protectionAmount,
    protectionExpirationTimestamp:
      (await getLatestBlockTimestamp(provider)) +
      86400 * protectionDurationInDays
  };

  // await poolInstance.connect(buyer).buyProtection(purchaseParams, {
  //   gasPrice: "259000000000",
  //   gasLimit: "210000000"
  // });

  console.log("Protection purchase params: ", purchaseParams);

  await sendTransaction(
    provider,
    buyerAddress,
    poolInstance,
    "buyProtection",
    purchaseParams
  );

  console.log(
    "Total protection after buyProtection: ",
    formatUSDC(await poolInstance.totalProtection())
  );

  console.log("Finished buyProtection");
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

export async function deletePlayground(forkId: string) {
  await deleteFork(forkId);
}
