"use client";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useAccount } from "wagmi";
import type { Address } from "abitype";
import { connectModalAtom } from "@/atoms";
import useAllowance from "@/hooks/useAllowance";
import Spinner from "@/components/Spinner";
import useApprove from "@/hooks/useApprove";
import { cn } from "@/utils/utils";
import { useSnackbar } from "notistack";
import { getDecimalMul } from "@/utils/utils";
import { USDC_NUM_OF_DECIMALS } from "@/utils/usdc";

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

  const ApproveButton = () => {
    const allowance = useAllowance(
      targetAddress,
      address,
      spenderAddress,
      "useAllowanceSubmitButton"
    );
    const approve = useApprove(targetAddress, address, spenderAddress);
    const loading: boolean =
      approve.writeFn.isLoading || approve.waitFn.isLoading;

    const handleApprove = () => {
      try {
        approve.writeFn?.write();
      } catch (e) {
        enqueueSnackbar(e.message, {
          variant: "error"
        });
      }
    };

    useEffect(() => {
      if (approve.waitFn.isSuccess) {
        enqueueSnackbar("Approved", {
          variant: "success"
        });
      }
    }, [approve.waitFn.isSuccess]);

    return (
      <>
        {isConnected ? (
          allowance.isLoaded &&
          allowance?.data?.gt(
            getDecimalMul(allowanceVal ?? "0", USDC_NUM_OF_DECIMALS)
          ) ? (
            <button
              className={cn(
                "text-white bg-customBlue rounded-md w-full md:w-fit px-14 py-4 py-2 md:py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
                "text-white bg-customBlue rounded-md w-full md:w-fit px-14 py-4 py-2 md:py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                className
              )}
              type="button"
              disabled={!targetAddress || loading}
              onClick={() => handleApprove()}
            >
              {loading ? (
                <div className="w-5 h-5">
                  <Spinner />
                </div>
              ) : (
                <span>Approve</span>
              )}
            </button>
          )
        ) : (
          <button
            className={cn(
              "text-white bg-customBlue rounded-md w-full md:w-fit px-14 py-2 md:py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
