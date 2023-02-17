"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { UserContext } from "@contexts/UserContextProvider";
import { Tooltip } from "@material-tailwind/react";
// import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import SellProtectionPopUp from "./SellProtectionPopUp";
import { useRouter } from "next/router";
import numeral from "numeral";
import { SellProtectionInput } from "@type/types";
// import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { Info } from "lucide-react";
import { useAccount } from "wagmi";
import useUsdcBalance from "@hooks/useUsdcBalance";
import useEthBalance from "@hooks/useEthBalance";

export default function SellProtectionCard(props) {
  const { isConnected } = useAccount();
  const { estimatedAPY } = props;
  const { data: usdcBalance, isLoading: isLoadingUsdc } = useUsdcBalance();
  const ethBalance = useEthBalance();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<SellProtectionInput>({ defaultValues: { depositAmount: "0" } });

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // const { updateUserUsdcBalance } = useContext(UserContext);
  // const { provider } = useContext(ApplicationContext);
  const protectionPoolAddress = router.query.address;

  const setMaxAmount = async () => {
    setValue("depositAmount", usdcBalance.toString());
  };

  // useEffect(() => {
  //   (async () => {
  //     provider &&
  //       setUsdcBalance(convertUSDCToNumber(await updateUserUsdcBalance()));
  //   })();
  // }, [isOpen]);

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
        <h5 className="text-left text-customGrey text-xl  font-normal mt-4 mb-2 flex items-center">
          Deposit Amount
        </h5>
        <input
          className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
          type="number"
          {...register("depositAmount", {
            min: 1,
            max: usdcBalance?.value.toNumber(),
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
          Balance: {usdcBalance?.formatted}&nbsp;USDC
        </div>
        <button
          className="text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={!protectionPoolAddress} // todo: add the leverage ratio limit
        >
          Deposit
        </button>
      </form>
      <SellProtectionPopUp
        open={isOpen}
        onClose={() => setIsOpen(false)}
        amount={getValues("depositAmount")}
        protectionPoolAddress={protectionPoolAddress}
        estimatedAPY={estimatedAPY}
      ></SellProtectionPopUp>
    </div>
  );
}
