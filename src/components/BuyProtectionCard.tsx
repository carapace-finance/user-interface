import { useState } from "react";
import { Input, Radio } from "@material-tailwind/react";
import BuyProtectionPopUp from "./BuyProtectionPopUp";

export default function BuyProtectionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(false);
  const [duration, setDuration] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          Estimated Adjusted Yields
        </h5>
        <p className="text-gray-700 text-base mb-4">7 - 10%</p>
        <div
          className="flex gap-10"
          // onChange={(e) => setAmount(e.target.value)}
        >
          <Radio id="full" name="type" label="Full" defaultChecked />
          <Radio id="1/2" name="type" label="1/2" />
          <Radio id="1/4" name="type" label="1/4" />
        </div>
        <div
          className="flex gap-10"
          // onChange={(e) => setDuration(e.target.value)}
        >
          <Radio id="full" name="type" label="full" defaultChecked />
          <Radio id="90days" name="type" label="90 Days" />
        </div>
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Preview
        </button>
        <BuyProtectionPopUp
          open={isOpen}
          onClose={() => setIsOpen(false)}
          amount={amount}
          duration={duration}
        ></BuyProtectionPopUp>
      </div>
    </div>
  );
}
