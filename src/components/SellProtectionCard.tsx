import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { Tooltip } from "@material-tailwind/react";
import { getUsdcBalance, convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import SellProtectionPopUp from "./SellProtectionPopUp";
import { useRouter } from "next/router";
import numeral from "numeral";
import { SellProtectionInput } from "@type/types"

export default function SellProtectionCard() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<SellProtectionInput>({ defaultValues: { depositAmount: 0 } });

  const [isOpen, setIsOpen] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const router = useRouter();
  const { protectionPoolService, provider } = useContext(ApplicationContext);
  const { user, setUser } = useContext(UserContext);
  const protectionPoolAddress = router.query.address;

  const setMaxAmount = async () => {
    setValue("depositAmount", usdcBalance);
  };

  useEffect(() => {
    (async () => {
      if (provider) {
        let newUsdcBalance = await getUsdcBalance(provider, user.address);
        setUsdcBalance(convertUSDCToNumber(newUsdcBalance));
        if (newUsdcBalance != user.USDCBalance) {
          setUser({ ...user, USDCBalance: newUsdcBalance });
        }
      }
    })();
  }, [isOpen]);

  const onSubmit = () => {
    setIsOpen(true);
  }; // your form submit function which will invoke after successful validation

  return (
    <div className="flex justify-center ">
      <div className="rounded-2xl shadow-table p-8 bg-white max-w-sm">
        <div className="flex flex-row items-center">
          <h5 className="text-left text-gray-700 text-base mr-1">
            Estimated APY
          </h5>
          <Tooltip
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
            content="Estimated APY for protection sellers."
            placement="top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#6E7191"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </Tooltip>
        </div>
        <p className="text-left text-3xl mb-4">18 - 25%</p>
        <div className="h-1 border-b border-headerBorder"></div>
        <div className="h-5"></div>
        <div className="flex flex-row justify-start">
          <div className="flex-col mr-3">
            <p className="text-left text-gray-700 text-xs">Interest from Premium</p>
            <p className="text-left text-xl">10 - 15%</p>
          </div>
          <div className="flex-col">
            <p className="text-left text-gray-700 text-xs">CARA Token Rewards</p>
            <p className="text-left text-xl">8 - 10%</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-left text-gray-700 text-base mt-5">Deposit Amount</div>
        <input 
          className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
          type="number"
          {...register("depositAmount", { min: 0, max: usdcBalance && 10000000, required: true })} 
        />
        {errors.depositAmount && (
          <h5 className="block text-left text-buttonPink text-base leading-tight font-normal mb-4">the deposit amount must be in between 0 and the deposit amount available if you have enough balance</h5>
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
        <p>Balance: {numeral(usdcBalance).format(USDC_FORMAT)} USDC</p>
        <input 
          className="border border-black rounded-md px-14 py-4 mb-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          type="submit" 
          value="Preview"
          disabled={!getValues("depositAmount") || getValues("depositAmount") > usdcBalance}
        />
        </form>
        <SellProtectionPopUp
          open={isOpen}
          onClose={() => setIsOpen(false)}
          amount={getValues("depositAmount")}
          protectionPoolAddress={protectionPoolAddress}
        ></SellProtectionPopUp>
      </div>
    </div>
  );
}
