"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Tooltip } from "@material-tailwind/react";
import SellProtectionPopUp from "@/components/SellProtectionPopUp";
import { SellProtectionInput } from "@type/types";
import { Info } from "lucide-react";
import { useAccount } from "wagmi";
import useUsdcBalance from "@/hooks/useUsdcBalance";
import SubmitButton from "@/components/SubmitButton";
import useAllowance from "@/hooks/useAllowance";
import { USDC_ADDRESS, USDC_NUM_OF_DECIMALS } from "@/utils/usdc";
import { getDecimalDivFormatted } from "@/utils/utils";
import { BigNumber } from "ethers";
import Image from "next/image";
import dollarSign from "../assets/dollarSign.png";

export default function SellProtectionCard(props) {
  const { estimatedAPY } = props;
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<SellProtectionInput>({ defaultValues: { depositAmount: "0" } });

  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const protectionPoolAddress: any = router.query.address;
  const allowance = useAllowance(
    USDC_ADDRESS,
    address,
    protectionPoolAddress,
    "useAllowanceSellProtctionCard"
  );
  const { data: usdcBalance, isLoading: isLoadingUsdc } = useUsdcBalance();

  const setMaxAmount = async () => {
    setValue("depositAmount", usdcBalance.toString());
  };

  const onSubmit = () => {
    setIsOpen(true);
  }; // your form submit function which will invoke after successful validation

  return (
    <div className="py-4 md:py-10 px-4 md:px-8 bg-white rounded-2xl shadow-boxShadow shadow-lg shadow-gray-200">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-left text-customGrey font-normal flex items-center">
          {!isConnected ||
          allowance?.data?.gt(BigNumber.from(getValues("depositAmount")))
            ? "Deposit"
            : "Approve"}
          &nbsp;Amount
        </label>
        <div className="mb-0 mt-4">
          <div className="flex flex-col  px-4 py-3 rounded-2xl bg-gray-100 ">
            <div className="flex items-center justify-between w-full">
              <input
                className="block outline-none text-xl w-full text-black rounded bg-gray-100 out"
                type="number"
                {...register("depositAmount", {
                  min: 1,
                  max: usdcBalance?.value?.toNumber() ?? 1,
                  required: true
                })}
                onWheel={(e: any) => e.target.blur()}
              />
              <div className="flex items-center">
                <Image
                  src={dollarSign}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-1"
                />
                USDC
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-1">
              <p className="text-xs text-gray-500">{' '}</p>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 mr-2">
                  Balance:{" "}
                  {!isConnected
                    ? "-"
                    : isLoadingUsdc
                    ? "..."
                    : getDecimalDivFormatted(
                        usdcBalance?.value,
                        USDC_NUM_OF_DECIMALS
                      )}
                </p>
                <p className="text-sm text-customBlue">Max</p>
              </div>
            </div>
          </div>
          {errors.depositAmount && (
            <h5 className="block text-left text-customPink text-xs md:text-base leading-tight font-normal mb-4 mt-3">
              the deposit amount must be in between 0 and your USDC balance
            </h5>
          )}
        </div>
        {/* <input
          className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
          type="number"
          {...register("depositAmount", {
            min: 1,
            max: usdcBalance?.value?.toNumber() ?? 1,
            required: true
          })}
          onWheel={(e: any) => e.target.blur()}
        />
        {errors.depositAmount && (
          <p className="block text-left text-customPink text-base font-normal mb-4">
            the deposit amount must be in between 0 and your USDC balance
          </p>
        )} */}
        {/* <TextField
        </h5>
        <div className="md:hidden mb-4">
          <div className="flex flex-col  px-4 py-3 rounded-2xl bg-gray-100 ">
            <div className="flex items-center justify-between w-full">
              <input
                className="block outline-none text-xl w-full text-black rounded bg-gray-100 out"
                type="number"
                {...register("depositAmount", {
                  min: 1,
                  max: usdcBalance?.value?.toNumber() ?? 1,
                  required: true
                })}
                onWheel={(e: any) => e.target.blur()}
              />
              <div className="flex items-center">
                <Image
                  src={dollarSign}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-1"
                />
                USDC
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-1">
              <p className="text-xs text-gray-500">$150002.9</p>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 mr-2">
                  Balance:{" "}
                  {!isConnected
                    ? "-"
                    : isLoadingUsdc
                    ? "..."
                    : getDecimalDivFormatted(
                        usdcBalance?.value,
                        USDC_NUM_OF_DECIMALS
                      )}
                  &nbsp;
                </p>
                <p className="text-sm text-customBlue">Max</p>
              </div>
            </div>
          </div>
          {errors.depositAmount && (
            <h5 className="block text-left text-customPink text-xs md:text-base leading-tight font-normal mb-4 mt-3">
              the deposit amount must be in between 0 and your USDC balance
            </h5>
          )}
        </div>
        <div className="hidden md:block">
          <input
            className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
            type="number"
            {...register("depositAmount", {
              min: 1,
              max: usdcBalance?.value?.toNumber() ?? 1,
              required: true
            })}
            onWheel={(e: any) => e.target.blur()}
          />
          {errors.depositAmount && (
            <p className="block text-left text-customPink text-base font-normal mb-4">
              the deposit amount must be in between 0 and your USDC balance
            </p>
          )}
          {/* <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">USDC</InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={!protectionPoolService}
                  onClick={setMaxAmount}
                  size="sm"
                >
                  Max
                </IconButton>
              </InputAdornment>
            )
          }}
        /> */}
        {/* <div className="text-right text-customGrey text-sm">
          Balance:&nbsp;
          {!isConnected
            ? "-"
            : isLoadingUsdc
            ? "..."
            : getDecimalDivFormatted(usdcBalance?.value, USDC_NUM_OF_DECIMALS)}
          &nbsp;USDC
        </div> */}
        {/* </div> */}
        <div className="w-full flex justify-center">
          <SubmitButton
            buttonText="Deposit"
            targetAddress={USDC_ADDRESS}
            spenderAddress={protectionPoolAddress}
            allowanceVal={getValues("depositAmount")}
            needApprove
          />
        </div>
      </form>
      <SellProtectionPopUp
        open={isOpen}
        onClose={() => setIsOpen(false)}
        amount={getValues("depositAmount")}
        protectionPoolAddress={protectionPoolAddress}
        estimatedAPY={estimatedAPY}
      />
    </div>
  );
}
