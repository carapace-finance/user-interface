// @ts-nocheck
import { hexValue } from "@ethersproject/bytes";
import { parseEther } from "ethers/lib/utils";
import { ContractFactory, Contract, Signer } from "ethers";
import { fillEther } from "./tenderly";
import { protocolParameters } from "@constants/index";

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
import { Artifact, linkBytecode } from "./bytecode";

import { USDC_ADDRESS, parseUSDC } from "../usdc";
import { getDaysInSeconds } from "@utils/utils";

//  Artifacts for contracts that have dependencies on libraries
import accruedPremiumCalculatorArtifact from "../../contracts/forked/artifacts/AccruedPremiumCalculator.json";
import premiumCalculatorArtifact from "../../contracts/forked/artifacts/PremiumCalculator.json";
import poolFactoryArtifact from "../../contracts/forked/artifacts/PoolFactory.json";
import poolHelperArtifact from "../../contracts/forked/artifacts/PoolHelper.json";
import { isLendingPoolLate, payToLendingPoolAddress } from "./goldfinch";
import { Provider } from "@ethersproject/providers";
import { JsonRpcProvider } from "@ethersproject/providers";

let deployer: Provider | Signer;
let account1: Signer;

let protectionPoolInstance: Contract;
let poolFactoryInstance: Contract;
let premiumCalculatorInstance: Contract;
let referenceLendingPoolsInstance: Contract;
let poolCycleManagerInstance: Contract;
let accruedPremiumCalculatorInstance: Contract;
let riskFactorCalculatorInstance: Contract;
let referenceLendingPoolsFactoryInstance: Contract;
let referenceLendingPoolsImplementation: Contract;
let defaultStateManagerInstance: Contract;

// Lending positions of pool can be found by looking at withdrawal txs in goldfinch app,
// then open it in etherscan and look at logs data for TokenRedeemed event
export const PLAYGROUND_LENDING_POOL_DETAILS_BY_ADDRESS = {
  // https://app.goldfinch.finance/pools/0xb26b42dd5771689d0a7faeea32825ff9710b9c11
  // Name: Lend East #1: Emerging Asia Fintech Pool
  // Payment date: 14 of every month
  // lending positions:
  // 645: 0x4902b20bb3b8e7776cbcdcb6e3397e7f6b4e449e, 158751.936393
  "0xb26b42dd5771689d0a7faeea32825ff9710b9c11": {
    name: "Lend East #1: Emerging Asia Fintech Pool",
    lendingPosition: {
      tokenId: 645,
      owner: "0x4902b20bb3b8e7776cbcdcb6e3397e7f6b4e449e"
    }
  },

  // https://app.goldfinch.finance/pools/0xd09a57127bc40d680be7cb061c2a6629fe71abef
  // Name: Cauris Fund #2: Africa Innovation Pool
  // Next repayment date: 21 of every month
  // lending positions:
  // 590: 0x008c84421da5527f462886cec43d2717b686a7e4  420,000.000000
  "0xd09a57127bc40d680be7cb061c2a6629fe71abef": {
    name: "Cauris Fund #2: Africa Innovation Pool",
    lendingPosition: {
      tokenId: 590,
      owner: "0x008c84421da5527f462886cec43d2717b686a7e4"
    }
  },

  // https://app.goldfinch.finance/pools/0x89d7c618a4eef3065da8ad684859a547548e6169
  // Next repayment date: 22 of every month
  // lending positions:
  // 717: 0x3371E5ff5aE3f1979074bE4c5828E71dF51d299c  808,000.000000
  "0x89d7c618a4eef3065da8ad684859a547548e6169": {
    name: "Asset-Backed Pool via Addem Capital",
    lendingPosition: {
      tokenId: 717,
      owner: "0x3371E5ff5aE3f1979074bE4c5828E71dF51d299c"
    }
  }

  // https://app.goldfinch.finance/pools/0x759f097f3153f5d62ff1c2d82ba78b6350f223e3
  // Name: Almavest Basket #7: Fintech and Carbon Reduction Basket
  // next repayment date: Jan 7, 2023
  // Lending positions:
  // 699: 0x94e0bC3aedA93434B848C49752cfC58B1e7c5029  90,000.000000
  // "0x759f097f3153f5d62ff1c2d82ba78b6350f223e3": {
  //   name: "Almavest Basket #7: Fintech and Carbon Reduction Basket",
  //   lendingPosition: {
  //     tokenId: 699,
  //     owner: "0x94e0bC3aedA93434B848C49752cfC58B1e7c5029"
  //   }
  // }

  // https://app.goldfinch.finance/pools/0xc9bdd0d3b80cc6efe79a82d850f44ec9b55387ae
  // Name: Cauris
  // Lending positions:
  // 106: 0xdB86B02928C47CB1c1D231B21732E6C639b28051  30000.000000
  // "0xc9bdd0d3b80cc6efe79a82d850f44ec9b55387ae": {
  //   name: "Cauris",
  //   lendingPosition: {
  //     tokenId: 179,
  //     owner: "0x8481a6EbAf5c7DABc3F7e09e44A89531fd31F822"
  //   }
  // }

  // "0x418749e294cabce5a714efccc22a8aade6f9db57"
};

export const GOLDFINCH_LENDING_POOLS = Object.keys(
  PLAYGROUND_LENDING_POOL_DETAILS_BY_ADDRESS
);
const _lendingProtocols = GOLDFINCH_LENDING_POOLS.map(() => 0); // 0 = Goldfinch
const _purchaseLimitInDays = hexValue(
  protocolParameters.protectionPurchaseLimitsInDays
);
const _purchaseLimitsInDays = GOLDFINCH_LENDING_POOLS.map(
  () => _purchaseLimitInDays
);

function getLinkedBytecode(contractArtifact: Artifact, libRefs: any[]) {
  const libs = libRefs.map((libRef: { libraryName: any; address: any }) => {
    return {
      sourceName: `contracts/libraries/${libRef.libraryName}.sol`,
      libraryName: libRef.libraryName,
      address: libRef.address
    };
  });
  return linkBytecode(contractArtifact, libs);
}

const deployContracts = async (forkProvider: JsonRpcProvider) => {
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
    console.log(
      "referenceLendingPoolsFactoryInstance.address ==>",
      referenceLendingPoolsFactoryInstance.address
    );

    console.log(
      "Creating ReferenceLendingPools instance using GOLDFINCH_LENDING_POOLS ==> ",
      GOLDFINCH_LENDING_POOLS
    );

    // If lending pools are late for payment, pay them
    const promises = GOLDFINCH_LENDING_POOLS.map(async (lendingPoolAddress) => {
      return isLendingPoolLate(lendingPoolAddress, forkProvider).then(
        async (late: any) => {
          if (late) {
            console.log("Paying late lending pool: ", lendingPoolAddress);
            await payToLendingPoolAddress(
              lendingPoolAddress,
              "300000",
              forkProvider
            );

            if (await isLendingPoolLate(lendingPoolAddress, forkProvider)) {
              console.log("Lending pool is still late: ", lendingPoolAddress);
              throw new Error(
                `Failed to create ReferenceLendingPools because lending pool: ${lendingPoolAddress} is late for payment.`
              );
            }

            console.log("Paid late lending pool: ", lendingPoolAddress);
          } else {
            console.log("Lending pool is not late: ", lendingPoolAddress);
          }
        }
      );
    });
    await Promise.all(promises);

    const tx1 =
      await referenceLendingPoolsFactoryInstance.createReferenceLendingPools(
        GOLDFINCH_LENDING_POOLS,
        _lendingProtocols,
        _purchaseLimitsInDays,
        {
          gasPrice: "25900000000",
          gasLimit: "210000000"
        }
      );

    const referenceLendingPoolsList =
      await referenceLendingPoolsFactoryInstance.getReferenceLendingPoolsList();
    referenceLendingPoolsInstance = new Contract(
      referenceLendingPoolsList[0],
      referenceLendingPoolsAbi,
      deployer
    );

    console.log(
      "ReferenceLendingPools instance created at: ",
      referenceLendingPoolsInstance.address
    );

    // Deploy PoolHelper library contract
    const accruedPremiumCalculatorLibRef = {
      libraryName: "AccruedPremiumCalculator",
      address: accruedPremiumCalculatorInstance.address
    };

    const poolHelperBytecode = getLinkedBytecode(poolHelperArtifact, [
      accruedPremiumCalculatorLibRef
    ]);
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
      accruedPremiumCalculatorLibRef,
      poolHelperLibRef
    ]);
    const poolFactoryFactory = new ContractFactory(
      poolFactoryAbi,
      poolFactoryBytecode,
      deployer
    );
    poolFactoryInstance = await poolFactoryFactory.deploy({
      gasPrice: "25900000000",
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
      openCycleDuration: getDaysInSeconds(
        protocolParameters.openCycleDurationInDays
      ),
      cycleDuration: getDaysInSeconds(protocolParameters.cycleDurationInDays)
    };

    const _poolParams = {
      leverageRatioFloor: parseEther(protocolParameters.leverageRatioFloor),
      leverageRatioCeiling: parseEther(protocolParameters.leverageRatioCeiling),
      leverageRatioBuffer: parseEther(protocolParameters.leverageRatioBuffer),
      minRequiredCapital: parseUSDC("100000"), // 100k
      curvature: parseEther("0.05"),
      minCarapaceRiskPremiumPercent: parseEther("0.02"),
      underlyingRiskPremiumPercent: parseEther("0.1"),
      minProtectionDurationInSeconds: getDaysInSeconds(
        protocolParameters.minProtectionDurationInDays
      ),
      poolCycleParams: _poolCycleParams,
      protectionExtensionGracePeriodInSeconds: getDaysInSeconds(
        protocolParameters.protectionExtensionGracePeriodInDays
      )
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

    protectionPoolInstance = new Contract(
      await poolFactoryInstance.getPoolAddress(1),
      poolAbi,
      deployer
    );

    console.log("Pool instance created at: ", protectionPoolInstance.address);

    return {
      poolCycleManagerInstance,
      poolFactoryInstance,
      protectionPoolInstance,
      premiumCalculatorInstance
    };
  } catch (e) {
    console.log(e);
  }
};

export { deployContracts };
