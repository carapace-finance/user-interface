"use client";
import React from "react";
import useAllowance from "@hooks/useAllowance";
import useApprove from "@hooks/useApprove";
import { BigNumber } from "@ethersproject/bignumber";
import { useSetAtom } from "jotai";
import { connectModalAtom } from "@/atoms";
import { cn } from "@utils/utils";
import { useAccount } from "wagmi";
import type { Address } from "abitype";

type Props = {
  targetAddress?: Address;
  spenderAddress?: Address;
  needApprove?: boolean;
  className?: string;
  allowanceVal?: string;
};

export default function ApproveSubmitButton({
  needApprove = false,
  targetAddress,
  spenderAddress,
  className,
  allowanceVal,
  ...props
}: Props) {
  const { isConnected, address } = useAccount();
  const setModalOpen = useSetAtom(connectModalAtom);

  const ApproveButton = () => {
    const allowance = useAllowance(targetAddress, address, spenderAddress);
    const approve = useApprove(targetAddress, address, spenderAddress);

    const handleApprove = async () => {
      console.log("handleApprove", approve);
      await approve.writeFn?.writeAsync();
    };

    return (
      <>
        {isConnected ? (
          allowance.isLoaded &&
          allowance?.data?.gt(BigNumber.from(allowanceVal)) ? (
            <button
              className={cn(
                "text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                className
              )}
              {...props}
              type="submit"
              disabled={!targetAddress} // todo: add the leverage ratio limit
            >
              Deposit
            </button>
          ) : (
            <button
              className={cn(
                "text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                className
              )}
              type="button"
              disabled={!targetAddress}
              onClick={() => handleApprove()}
            >
              Approve
            </button>
          )
        ) : (
          <button
            className={cn(
              "text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            type="button"
            onClick={() => setModalOpen(true)}
          >
            Connect
          </button>
        )}
      </>
    );
  };

  const OnlySubmitButton = () => {
    return (
      <>
        {isConnected ? (
          <button
            className={cn(
              "text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
            type="submit"
            disabled={!targetAddress} // todo: add the leverage ratio limit
          >
            Deposit
          </button>
        ) : (
          <button
            className={cn(
              "text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            type="button"
            onClick={() => setModalOpen(true)}
          >
            Connect
          </button>
        )}
      </>
    );
  };

  return needApprove ? <ApproveButton /> : <OnlySubmitButton />;
}
