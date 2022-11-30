import { useState } from "react";
import { Input } from "@material-tailwind/react";
import SellProtectionPopUp from "./SellProtectionPopUp";
import { useRouter } from "next/router";

export default function SellProtectionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const protectionPoolAddress = router.query.address;

  return (
    <div className="flex justify-center">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          Estimated APY
        </h5>
        <p className="text-gray-700 text-base mb-4">18 - 25%</p>
        <Input
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
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
