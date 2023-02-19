import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

export const connectModalAtom = atom<boolean>(false);
