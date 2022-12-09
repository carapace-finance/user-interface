import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { Input } from "@material-tailwind/react";
import { getUsdcBalance, convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import SellProtectionPopUp from "./SellProtectionPopUp";
import { useRouter } from "next/router";
import numeral from "numeral";

export default function SellProtectionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const { provider } = useContext(ApplicationContext);
  const { user, setUser } = useContext(UserContext);
  const protectionPoolAddress = router.query.address;

  useEffect(() => {
    (async () => {
      if (provider) {
        let USDCBalance = await getUsdcBalance(provider, user.address);
        USDCBalance = numeral(convertUSDCToNumber(USDCBalance)).format(USDC_FORMAT);
        if (USDCBalance != user.USDCBalance) {
          setUser({ ...user, USDCBalance: USDCBalance });
        }
      }
    })();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          Estimated APY
        </h5>
        <p className="text-gray-700 text-base mb-4">18 - 25%</p>
        <div>Deposit Amount</div>
        <Input
          label="0.0"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p>Balance: {user.USDCBalance}</p>
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          disabled={!amount || amount === "0"}
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
