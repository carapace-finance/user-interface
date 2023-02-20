"use client";
import { useState, useEffect } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { useSetAtom } from "jotai";
import { useAccount } from "wagmi";
import type { Address } from "abitype";
import { connectModalAtom } from "@/atoms";
import useAllowance from "@/hooks/useAllowance";
import Spinner from "@/components/Spinner";
import useApprove from "@/hooks/useApprove";
import { cn } from "@/utils/utils";
import { useSnackbar } from "notistack";

type Props = {
  buttonText: string;
  allowanceVal?: string;
  needApprove?: boolean;
  targetAddress?: Address;
  spenderAddress?: Address;
  className?: string;
};

export default function ApproveSubmitButton({
  buttonText,
  needApprove = false,
  targetAddress,
  spenderAddress,
  className,
  allowanceVal,
  ...props
}: Props) {
  const { isConnected, address } = useAccount();
  const setModalOpen = useSetAtom(connectModalAtom);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const ApproveButton = () => {
    const allowance = useAllowance(targetAddress, address, spenderAddress);
    const approve = useApprove(targetAddress, address, spenderAddress);

    const handleApprove = async () => {
      try {
        setLoading(true);
        await approve.writeFn?.writeAsync();
      } catch (e) {
        setLoading(false);
        enqueueSnackbar(e.message, {
          variant: "error"
        });
      }
    };

    useEffect(() => {
      if (approve.waitFn.isSuccess) {
        setLoading(false);
        enqueueSnackbar("Approved", {
          variant: "success"
        });
      }
    }, [approve.waitFn.isSuccess]);

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
              {buttonText}
            </button>
          ) : (
            <button
              className={cn(
                "text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                className
              )}
              type="button"
              disabled={loading || !targetAddress}
              onClick={() => handleApprove()}
            >
              {loading ? <Spinner /> : <span>Approve</span>}
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
            disabled={!targetAddress}
          >
            {buttonText}
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
