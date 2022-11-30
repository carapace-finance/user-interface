import { useState } from "react";
import { Input } from "@material-tailwind/react";
import BuyProtectionPopUp from "./BuyProtectionPopUp";
import { useRouter } from "next/router";

export default function BuyProtectionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [protectionAmount, setProtectionAmount] = useState(0);
  const [protectionDurationInDays, setProtectionDurationInDays] = useState(90);
  const [tokenId, setTokenId] = useState(0);

  const router = useRouter();

  return (
    <div className="flex justify-center">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
          Estimated Adjusted Yields
        </h5>
        <p className="text-gray-700 text-base mb-4">7 - 10%</p>
        <div className="flex w-72 flex-col gap-4">
          <Input
          label="Protection Amount"
          value={protectionAmount}
          onChange={(e) => setProtectionAmount(e.target.value)}
        />
        <Input
          label="Protection Duration (days)"
          value={protectionDurationInDays}
          onChange={(e) => setProtectionDurationInDays(e.target.value)}
          />
          <Input
          label="Goldfinch Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        </div>
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          disabled={protectionAmount === 0 || protectionDurationInDays === 0 || tokenId === 0}
          onClick={() => setIsOpen(true)}
        >
          Preview
        </button>
        <BuyProtectionPopUp
          open={isOpen}
          onClose={() => setIsOpen(false)}
          protectionAmount={protectionAmount}
          protectionDurationInDays={protectionDurationInDays}
          tokenId={tokenId}
          lendingPoolAddress={router.query.address}
          protectionPoolAddress={router.query.protectionPoolAddress}
        ></BuyProtectionPopUp>
      </div>
    </div>
  );
}
