import { BigNumber } from "@ethersproject/bignumber";
import { hexValue } from "@ethersproject/bytes";
import { parseEther } from "ethers/lib/utils";
import { ContractFactory, Contract } from "ethers";
import { fillEther } from "./tenderly";

import riskFactorCalculatorAbi from "../../contracts/forked/abi/RiskFactorCalculator.json";
import accruedPremiumCalculatorAbi from "../../contracts/forked/abi/AccruedPremiumCalculator.json";
import premiumCalculatorAbi from "../../contracts/forked/abi/PremiumCalculator.json";
import referenceLendingPoolsAbi from "../../contracts/forked/abi/ReferenceLendingPools.json";
import referenceLendingPoolsFactoryAbi from "../../contracts/forked/abi/ReferenceLendingPoolsFactory.json";
import poolFactoryAbi from "../../contracts/forked/abi/PoolFactory.json";
import defaultStateManagerAbi from "../../contracts/forked/abi/DefaultStateManager.json";
import poolAbi from "../../contracts/forked/abi/Pool.json";
import poolCycleManagerAbi from "../../contracts/forked/abi/PoolCycleManager.json";
import poolHelperAbi from "../../contracts/forked/abi/PoolHelper.json";

import { riskFactorCalculatorBytecode } from "../../contracts/forked/bytecode/RiskFactorCalculator";
import { referenceLendingPoolsBytecode } from "../../contracts/forked/bytecode/ReferenceLendingPools";
import { referenceLendingPoolsFactoryBytecode } from "../../contracts/forked/bytecode/ReferenceLendingPoolsFactory";
import { linkBytecode } from "./bytecode";

import { USDC_ADDRESS, parseUSDC } from "../usdc";

export const SECONDS_PER_DAY = 86400;

//  Artifacts for contracts that have dependencies on libraries
import accruedPremiumCalculatorArtifact from "../../contracts/forked/artifacts/AccruedPremiumCalculator.json";
import premiumCalculatorArtifact from "../../contracts/forked/artifacts/PremiumCalculator.json";
import poolFactoryArtifact from "../../contracts/forked/artifacts/PoolFactory.json";
import poolHelperArtifact from "../../contracts/forked/artifacts/PoolHelper.json";

let deployer;
let account1;

let poolInstance;
let poolFactoryInstance;
let premiumCalculatorInstance;
let referenceLendingPoolsInstance;
let poolCycleManagerInstance;
let accruedPremiumCalculatorInstance;
let riskFactorCalculatorInstance;
let referenceLendingPoolsFactoryInstance;
let referenceLendingPoolsImplementation;
let defaultStateManagerInstance;

const GOLDFINCH_LENDING_POOLS = [
  "0xb26b42dd5771689d0a7faeea32825ff9710b9c11",
  "0xd09a57127bc40d680be7cb061c2a6629fe71abef"
];

const getDaysInSeconds = (days) => {
  return BigNumber.from(days * SECONDS_PER_DAY);
};

function getLinkedBytecode(contractArtifact, libRefs) {
  const libs = libRefs.map((libRef) => {
    return {
      sourceName: `contracts/libraries/${libRef.libraryName}.sol`,
      libraryName: libRef.libraryName,
      address: libRef.address
    };
  });
  return linkBytecode(contractArtifact, libs);
}

const deployContracts = async (forkProvider) => {
  if (!process.env.NEXT_PUBLIC_FIRST_POOL_SALT)
    throw new Error("env var NEXT_PUBLIC_FIRST_POOL_SALT not set");

  deployer = await forkProvider.getSigner(0);
  account1 = await forkProvider.getSigner(1);
  await fillEther(await deployer.getAddress(), forkProvider);
  await fillEther(await account1.getAddress(), forkProvider);

  try {
    const riskFactorCalculatorFactory = new ContractFactory(
      riskFactorCalculatorAbi,
      riskFactorCalculatorBytecode,
      deployer
    );
    riskFactorCalculatorInstance = await riskFactorCalculatorFactory.deploy({
      gasLimit: "21000000"
    });
    await riskFactorCalculatorInstance.deployed();
    console.log(
      "RiskFactorCalculator deployed to:",
      riskFactorCalculatorInstance.address
    );

    const riskFactorLibRef = {
      libraryName: "RiskFactorCalculator",
      address: riskFactorCalculatorInstance.address
    };

    const accruedPremiumCalculatorBytecode = getLinkedBytecode(
      accruedPremiumCalculatorArtifact,
      [riskFactorLibRef]
    );
    const accruedPremiumCalculatorFactory = new ContractFactory(
      accruedPremiumCalculatorAbi,
      accruedPremiumCalculatorBytecode,
      deployer
    );
    accruedPremiumCalculatorInstance =
      await accruedPremiumCalculatorFactory.deploy();
    await accruedPremiumCalculatorInstance.deployed();
    console.log(
      "AccruedPremiumCalculator deployed to:",
      accruedPremiumCalculatorInstance.address
    );

    const premiumCalculatorBytecode = getLinkedBytecode(
      premiumCalculatorArtifact,
      [riskFactorLibRef]
    );
    const premiumCalculatorFactory = new ContractFactory(
      premiumCalculatorAbi,
      premiumCalculatorBytecode,
      deployer
    );
    premiumCalculatorInstance = await premiumCalculatorFactory.deploy();
    await premiumCalculatorInstance.deployed();
    console.log(
      "PremiumCalculator deployed to:",
      premiumCalculatorInstance.address
    );

    const referenceLendingPoolsFactory = new ContractFactory(
      referenceLendingPoolsAbi,
      referenceLendingPoolsBytecode,
      account1
    );
    // Deploy ReferenceLendingPools Implementation contract
    referenceLendingPoolsImplementation =
      await referenceLendingPoolsFactory.deploy();
    await referenceLendingPoolsImplementation.deployed();
    console.log(
      "ReferenceLendingPools Implementation" + " deployed to:",
      referenceLendingPoolsImplementation.address
    );

    const referenceLendingPoolsFactoryFactory = new ContractFactory(
      referenceLendingPoolsFactoryAbi,
      referenceLendingPoolsFactoryBytecode,
      deployer
    );
    referenceLendingPoolsFactoryInstance =
      await referenceLendingPoolsFactoryFactory.deploy(
        referenceLendingPoolsImplementation.address
      );
    await referenceLendingPoolsFactoryInstance.deployed();
    console.log(
      "ReferenceLendingPoolsFactory" + " deployed to:",
      referenceLendingPoolsFactoryInstance.address
    );

    // Create an instance of the ReferenceLendingPools
    const _lendingProtocols = [0, 0]; // 0 = Goldfinch
    const _purchaseLimitsInDays = [hexValue(90), hexValue(60)];
    console.log(
      "referenceLendingPoolsFactoryInstance.address ==>",
      referenceLendingPoolsFactoryInstance.address
    );
    const tx1 =
      await referenceLendingPoolsFactoryInstance.createReferenceLendingPools(
        GOLDFINCH_LENDING_POOLS,
        _lendingProtocols,
        _purchaseLimitsInDays,
        {
          gasPrice: "259000000000",
          gasLimit: "210000000"
        }
      );

    referenceLendingPoolsInstance =
      await getReferenceLendingPoolsInstanceFromTx(forkProvider, tx1);

    // Deploy PoolHelper library contract
    const accruedPremiumCalculatorLibRef = {
      libraryName: "AccruedPremiumCalculator",
      address: accruedPremiumCalculatorInstance.address
    };

    const poolHelperBytecode = getLinkedBytecode(
      poolHelperArtifact,
      [accruedPremiumCalculatorLibRef]
    );
    const poolHelperFactory = new ContractFactory(
      poolHelperAbi,
      poolHelperBytecode,
      deployer
    );
    const poolHelperInstance = await poolHelperFactory.deploy();
    await poolHelperInstance.deployed();
    console.log("PoolHelper deployed to: ", poolHelperInstance.address);

    // Deploy PoolFactory
    const poolHelperLibRef = {
      libraryName: "PoolHelper",
      address: poolHelperInstance.address
    };
    const poolFactoryBytecode = getLinkedBytecode(poolFactoryArtifact, [
      accruedPremiumCalculatorLibRef, poolHelperLibRef
    ]);
    const poolFactoryFactory = new ContractFactory(
      poolFactoryAbi,
      poolFactoryBytecode,
      deployer
    );
    poolFactoryInstance = await poolFactoryFactory.deploy({
      gasPrice: "259000000000",
      gasLimit: "21000000"
    });
    await poolFactoryInstance.deployed();
    console.log("PoolFactory" + " deployed to:", poolFactoryInstance.address);

    // Get PoolCycleManager instance from pool factory
    poolCycleManagerInstance = new Contract(
      await poolFactoryInstance.getPoolCycleManager(),
      poolCycleManagerAbi,
      deployer
    );
    console.log(
      "PoolCycleManager" + " is deployed at:",
      poolCycleManagerInstance.address
    );

    // Get DefaultStateManager instance from pool factory
    defaultStateManagerInstance = new Contract(
      await poolFactoryInstance.getDefaultStateManager(),
      defaultStateManagerAbi,
      deployer
    );
    console.log(
      "DefaultStateManager" + " is deployed at:",
      defaultStateManagerInstance.address
    );

    const _poolCycleParams = {
      openCycleDuration: getDaysInSeconds(10),
      cycleDuration: getDaysInSeconds(30)
    };

    const _poolParams = {
      leverageRatioFloor: parseEther("0.5"),
      leverageRatioCeiling: parseEther("1"),
      leverageRatioBuffer: parseEther("0.05"),
      minRequiredCapital: parseUSDC("100000"),  // 100k
      curvature: parseEther("0.05"),
      minCarapaceRiskPremiumPercent: parseEther("0.02"),
      underlyingRiskPremiumPercent: parseEther("0.1"),
      minProtectionDurationInSeconds: getDaysInSeconds(10),
      poolCycleParams: _poolCycleParams,
      protectionExtensionGracePeriodInSeconds: getDaysInSeconds(14) // 2 weeks
    };

    // Create a pool using PoolFactory instead of deploying new pool directly to mimic the prod behavior
    const _firstPoolFirstTrancheSalt = `0x${process.env.NEXT_PUBLIC_FIRST_POOL_SALT}`;

    const tx = await poolFactoryInstance.createPool(
      _firstPoolFirstTrancheSalt,
      _poolParams,
      USDC_ADDRESS,
      referenceLendingPoolsInstance.address,
      premiumCalculatorInstance.address,
      "sToken1",
      "ST1"
    );
    console.log("Pool creation tx ==> ", tx);

    poolInstance = await getPoolInstanceFromTx(tx);

    return { poolCycleManagerInstance, poolFactoryInstance, poolInstance };
  } catch (e) {
    console.log(e);
  }
};

async function getReferenceLendingPoolsInstanceFromTx(forkProvider, tx) {
  let receipt = await tx.wait();

  try {
    receipt = await tx.wait();
    console.log("receipt ==>", receipt);
  } catch (error) {
    console.error(error);
  }

  const referenceLendingPoolsCreatedEvent = receipt.events.find(
    (eventInfo) => eventInfo.event === "ReferenceLendingPoolsCreated"
  );

  const newReferenceLendingPoolsInstance = new Contract(
    referenceLendingPoolsCreatedEvent.args.referenceLendingPools,
    referenceLendingPoolsAbi,
    deployer
  );
  console.log(
    "ReferenceLendingPools instance created at: ",
    newReferenceLendingPoolsInstance.address
  );

  return newReferenceLendingPoolsInstance;
}

async function getPoolInstanceFromTx(tx) {
  const receipt = await tx.wait();

  const poolCreatedEvent = receipt.events.find(
    (eventInfo) => eventInfo.event === "PoolCreated"
  );

  const newPoolInstance = new Contract(
    poolCreatedEvent.args.poolAddress,
    poolAbi,
    deployer
  );

  console.log("Pool instance created at: ", newPoolInstance.address);

  return newPoolInstance;
}

export { deployContracts };
