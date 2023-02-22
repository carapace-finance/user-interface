import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Transaction } from "@/type/types";

export const connectModalAtom = atom<boolean>(false);

export const userTransactionsAtom = atomWithStorage<Transaction[]>(
  "carapace.transactions",
  []
);
