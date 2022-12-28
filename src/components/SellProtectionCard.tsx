import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "@contexts/UserContextProvider";
import { Tooltip } from "@material-tailwind/react";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import SellProtectionPopUp from "./SellProtectionPopUp";
import { useRouter } from "next/router";
import numeral from "numeral";
import { SellProtectionInput } from "@type/types";

export default function SellProtectionCard() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<SellProtectionInput>({ defaultValues: { depositAmount: "0" } });

  const [isOpen, setIsOpen] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const router = useRouter();
  const { updateUserUsdcBalance } = useContext(UserContext);
  const protectionPoolAddress = router.query.address;

  const setMaxAmount = async () => {
    setValue("depositAmount", usdcBalance.toString());
  };

  useEffect(() => {
    (async () => {
      setUsdcBalance(convertUSDCToNumber(await updateUserUsdcBalance()));
    })();
  }, [isOpen]);

  const onSubmit = () => {
    setIsOpen(true);
  }; // your form submit function which will invoke after successful validation

  return (
    <div className="py-10 px-8 bg-white rounded-2xl shadow-boxShadow shadow-lg shadow-gray-200 w-450 h-fit">
      <h5 className="text-left text-customGrey text-xl mb-2 flex items-center">
        Estimated APY
        <div className="pl-2">
          <Tooltip
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 }
            }}
            content="Estimated APY for protection sellers."
            placement="top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </Tooltip>
        </div>
      </h5>
      <div className="py-2 border-b border-gray-300">
        <h1 className="text-customDarkGrey text-4xl mb-4 text-left">
          18 - 25%
        </h1>
      </div>
      <div className="my-4">
        <div className="flex mb-4">
          <div>
            <h5 className="text-customGrey text-base flex mb-2 ">
              Interest from Premium
            </h5>
            <p className="text-left text-xl">10 - 15%</p>
          </div>
          <div className="ml-14">
            <h5 className="text-customGrey text-left text-base mb-2">
              CARA Token Rewards
            </h5>
            <p className="text-left text-xl">8 - 10%</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5 className="text-left text-customGrey text-xl  font-normal mb-2 flex items-center">
          Deposit Amount
        </h5>
        <input
          className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
          type="number"
          {...register("depositAmount", {
            min: 1,
            max: usdcBalance,
            required: true
          })}
        />
        {errors.depositAmount && (
          <h5 className="block text-left text-customPink text-base font-normal mb-4">
            the deposit amount must be in between 0 and the deposit amount
            available if you have enough balance
          </h5>
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
        <p className="text-right">
          USDC Balance: {numeral(usdcBalance).format(USDC_FORMAT)}
        </p>
        <input
          className="text-white bg-customBlue rounded-md px-14 py-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer"
          type="submit"
          value="Deposit"
          // disabled={} // todo: add the leverage ratio limit
        />
      </form>
      <SellProtectionPopUp
        open={isOpen}
        onClose={() => setIsOpen(false)}
        amount={getValues("depositAmount")}
        protectionPoolAddress={protectionPoolAddress}
      ></SellProtectionPopUp>
    </div>
  );
}
