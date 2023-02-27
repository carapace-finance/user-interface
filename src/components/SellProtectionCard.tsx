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
    <div className="py-10 px-8 bg-white rounded-2xl shadow-boxShadow shadow-lg shadow-gray-200">
      <h5 className="text-left text-customGrey text-xl mb-2 flex items-center">
        Estimated APY
        <div className="pl-2 cursor-pointer">
          <Tooltip
            className="cursor-pointer"
            content="Estimated APY for protection sellers."
            placement="top"
          >
            <Info size={18} />
          </Tooltip>
        </div>
      </h5>
      <div className="py-2 border-b border-gray-300">
        <h1 className="text-customDarkGrey text-4xl mb-4 text-left">
          {estimatedAPY}
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5 className="text-left text-customGrey text-xl font-normal mt-4 mb-2 flex items-center">
          {!isConnected ||
          allowance?.data?.gt(BigNumber.from(getValues("depositAmount")))
            ? "Deposit"
            : "Approve"}
          &nbsp;Amount
        </h5>
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
        <div className="text-right">
          Balance:&nbsp;
          {!isConnected
            ? "-"
            : isLoadingUsdc
            ? "..."
            : getDecimalDivFormatted(usdcBalance?.value, USDC_NUM_OF_DECIMALS)}
          &nbsp;USDC
        </div>
        <SubmitButton
          buttonText="Deposit"
          targetAddress={USDC_ADDRESS}
          spenderAddress={protectionPoolAddress}
          allowanceVal={getValues("depositAmount")}
          needApprove
        />
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
