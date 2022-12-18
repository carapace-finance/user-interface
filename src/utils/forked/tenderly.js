import { Signer } from "@ethersproject/abstract-signer";
import { hexValue } from "@ethersproject/bytes";
import { JsonRpcProvider } from "@ethersproject/providers";
import { parseEther, formatEther } from "@ethersproject/units";
import { deployContracts } from "./deploy";

export const fillEther = async (walletAddress, provider) => {
  const params = [
    [walletAddress],
    hexValue(parseEther("10")) // hex encoded wei amount
  ];
  await provider.send("tenderly_addBalance", params);
};

export const createFork = async (tenderlyAccessKey) => {
  const forkingPoint = { networkId: "1" };
  const options = {
    method: "POST",
    headers: {
      "X-Access-Key": tenderlyAccessKey,
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify({
      // standard TX fields
      network_id: forkingPoint.networkId,
      // block_number: 16088185,
      // simulation config (tenderly specific)
      save_if_fails: true,
      save: false,
      simulation_type: "quick"
    })
  };

  const TENDERLY_FORK_URL_FOR_CREATION = `https://api.tenderly.co/api/v1/account/${process.env.NEXT_PUBLIC_TENDERLY_USER}/project/${process.env.NEXT_PUBLIC_TENDERLY_PROJECT}/fork/`;
  let forkResponse = await fetch(TENDERLY_FORK_URL_FOR_CREATION, options);
  forkResponse = await forkResponse.json();
  return forkResponse.root_transaction.fork_id;
};

export const deployToFork = async (tenderlyAccessKey) => {
  let startTime = Date.now();
  const forkId = await createFork(tenderlyAccessKey);
  console.log("Created fork ==> ", forkId);
  console.log("Time taken to create fork: ", Date.now() - startTime);

  const TENDERLY_FORK_URL_FOR_REQUESTS = `https://rpc.tenderly.co/fork/${forkId}`;
  const forkProvider = new JsonRpcProvider(TENDERLY_FORK_URL_FOR_REQUESTS);

  startTime = Date.now();
  const deployedContracts = await deployContracts(forkProvider);
  console.log("Time taken to deploy contracts: ", Date.now() - startTime);

  const playground = {
    forkId,
    provider: forkProvider,
    deployedContracts
  };

  return playground;
};

export const sendTransaction = async (
  provider,
  sender,
  contract,
  funcName,
  ...args
) => {
  if (provider instanceof JsonRpcProvider) {
    const unsignedTx = await contract.populateTransaction[funcName](...args);
    const transactionParameters = [
      {
        to: contract.address,
        from: sender,
        data: unsignedTx.data,
        gas: hexValue(3000000),
        gasPrice: hexValue(1),
        value: hexValue(0)
      }
    ];
    try {
      const txHash = await provider.send(
        "eth_sendTransaction",
        transactionParameters
      );

      return {
        txHash: txHash
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  } else if (provider instanceof Signer) {
    try {
      const tx = await contract[funcName](...args);

      return {
        txHash: tx.hash
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

export const moveForwardTime = async (provider, seconds) => {
  await provider.send("evm_increaseTime", [hexValue(seconds)]);
  await provider.send("evm_increaseBlocks", [
    hexValue(1) // hex encoded number of blocks to increase
  ]);
};

export const deleteFork = async (forkId, tenderlyAccessKey) => {
  const TENDERLY_FORK_URL_TO_DELETE = `https://api.tenderly.co/api/v1/account/${process.env.NEXT_PUBLIC_TENDERLY_USER}/project/${process.env.NEXT_PUBLIC_TENDERLY_PROJECT}/fork/${forkId}`;

  const options = {
    method: "DELETE",
    headers: {
      "X-Access-Key": tenderlyAccessKey
    }
  };

  const response = await fetch(TENDERLY_FORK_URL_TO_DELETE, options);
  if (response.status === 204) {
    console.log("the fork is deleted... status =>", response.status);
  } else {
    // Handle errors
    console.log(response.status, response.statusText);
  }
};
