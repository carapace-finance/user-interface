import { useEffect } from "react";
import { useBlockNumber, useProvider, useNetwork, useAccount } from "wagmi";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { userTransactionsAtom } from "@/atoms";
import type { Transaction } from "@/type/types";

const useTransactionHandler = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [txs, setTxs] = useAtom(userTransactionsAtom);
  const blockNumber = useBlockNumber({
    chainId: chain?.id,
    scopeKey: "useTtansactionHandler",
    watch: true,
    enabled: !!chain && !!address
  });
  const provider = useProvider<any>();

  const addTx = (payload: Transaction) => {
    txs.push(payload);
    setTxs(txs);
  };

  const recieveTx = (payload: any) => {
    const item: any = (txs as Transaction[]).find(
      (item: Transaction) =>
        item.address === payload.address &&
        item.chainId === payload.chainId &&
        item.hash === payload.hash
    );
    if (item) {
      enqueueSnackbar(item.description, {
        variant:
          Number(payload.transactionReceipt?.status) === 1 ? "success" : "error"
      });
      removeTx(payload);
    }
  };

  const removeTx = (payload: Transaction) =>
    setTxs(
      (txs as Transaction[]).filter(
        (item: Transaction) =>
          !(
            item.address === payload.address &&
            item.chainId === payload.chainId &&
            item.hash === payload.hash
          )
      )
    );

  const clearTxs = (payload: any) =>
    setTxs(
      (txs as Transaction[]).filter(
        (item: any) =>
          !(
            item.address === payload.address && item.chainId === payload.chainId
          )
      )
    );

  useEffect(() => {
    if (!chain || !address || !blockNumber) return;
    (txs as Transaction[]).map(async (tx: any) => {
      await provider
        .getTransactionReceipt(tx.hash)
        .then(async (transactionReceipt: any) => {
          if (transactionReceipt) {
            recieveTx({
              chainId: chain.id,
              address,
              hash: transactionReceipt.transactionHash,
              transactionReceipt
            });
          }
        })
        .catch((e: any) => {
          console.log(`failed to check transaction hash: ${tx.hash}`, e);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, txs, blockNumber.data]);

  return {
    addTx,
    recieveTx,
    removeTx,
    clearTxs
  };
};

export default useTransactionHandler;
