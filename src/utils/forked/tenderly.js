import { Signer } from "@ethersproject/abstract-signer";
import { hexValue } from "@ethersproject/bytes";
import { JsonRpcProvider } from "@ethersproject/providers";
import { deployContracts } from "./deploy";

export const fillEther = async (walletAddress, provider) => {
  const params = [
    [walletAddress],
    hexValue(10000000) // hex encoded wei amount
  ];
  await provider.send("tenderly_addBalance", params);
};

export const createFork = async (tenderlyAccessKey) => {
  const forkingPoint = { networkId: "1", blockNumber: 15598870 }; // todo : is it possible for the block number to be causing the issue in the createReferenceLendingPools method? 
  const options = {
    method: "POST",
    headers: {
      "X-Access-Key": tenderlyAccessKey,
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify({
      // standard TX fields
      network_id: forkingPoint.networkId,
      block_number: forkingPoint.blockNumber,
      // simulation config (tenderly specific)
      save_if_fails: true,
      save: false,
      simulation_type: "quick"
    })
  };

  const TENDERLY_FORK_URL_FOR_CREATION = `https://api.tenderly.co/api/v1/account/${process.env.NEXT_PUBLIC_TENDERLY_USER}/project/${process.env.NEXT_PUBLIC_TENDERLY_PROJECT}/fork/`;
  let forkResponse = await fetch(TENDERLY_FORK_URL_FOR_CREATION, options);
  console.log('forkResponse ==>', forkResponse);
  forkResponse = await forkResponse.json();
  const forkId = forkResponse.root_transaction.fork_id;
  const TENDERLY_FORK_URL_FOR_REQUESTS = `https://rpc.tenderly.co/fork/${forkId}`;
  const forkProvider = new JsonRpcProvider(TENDERLY_FORK_URL_FOR_REQUESTS);
  return forkProvider;
};

export const deployToFork = async (tenderlyAccessKey) => {
  const forkProvider = await createFork(tenderlyAccessKey);
  await deployContracts(forkProvider);
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
    }
  } else if (provider instanceof Signer) {
    try {
      const tx = await contract[funcName](...args);

      return {
        txHash: tx.hash
      };
    } catch (err) {
      console.log(err);
    }
  }
};

export const deleteFork = async (forkId) => {
  const TENDERLY_FORK_URL_TO_DELETE = `TENDERLY_FORK_URL/${forkId}`;
  const options = {
    method: "DELETE",
    headers: {
      "X-Access-Key": process.env.TENDERLY_ACCESS_KEY
    }
  };

  const resp = fetch(TENDERLY_FORK_URL_TO_DELETE, options)
    .then((response) => {
      response.json();
      // console.log(
      //   `Forked with fork ID ${response.data.simulation_fork.id}. Check the Dashboard!`
      // );
    })
    .then((data) => {
      console.log(data);
    });

  return resp;
};