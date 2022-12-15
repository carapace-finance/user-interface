import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { InputAdornment, TextField } from "@mui/material";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { getUsdcBalance, convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import SellProtectionPopUp from "./SellProtectionPopUp";
import { useRouter } from "next/router";
import numeral from "numeral";

export default function SellProtectionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const router = useRouter();
  const { protectionPoolService, provider } = useContext(ApplicationContext);
  const { user, setUser } = useContext(UserContext);
  const protectionPoolAddress = router.query.address;

  const setMaxAmount = async () => {
    setAmount(usdcBalance);
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

  return (
    <div className="flex justify-center">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          Estimated APY
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
        </h5>
        <p className="text-gray-700 text-base mb-4">18 - 25%</p>
        <h5>Interest from Premium</h5>
        <p>10 - 15%</p>
        <h5>CARA Token Rewards</h5>
        <p>8 - 10%</p>
        <div>Deposit Amount</div>
        <TextField
          type="number"
          placeholder={"0.0"}
          variant="outlined"
          size="medium"
          InputProps={{
            inputProps: { min: "0" },
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
          value={amount}
          onChange={(e) =>
            setAmount(parseFloat(e.target.value))
          }
        />
        <p>Balance: {numeral(usdcBalance).format(USDC_FORMAT)} USDC</p>
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          // disabled={!amount || amount > usdcBalance} // todo: enable the button for styling
          onClick={() => setIsOpen(true)}
        >
          Preview
        </button>
        <SellProtectionPopUp
          open={isOpen}
          onClose={() => setIsOpen(false)}
          amount={amount}
          protectionPoolAddress={protectionPoolAddress}
        ></SellProtectionPopUp>
      </div>
    </div>
  );
}
