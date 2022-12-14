import { useState } from "react";
import { Input, Tooltip } from "@material-tailwind/react";
import BuyProtectionPopUp from "./BuyProtectionPopUp";
import { useRouter } from "next/router";

export default function BuyProtectionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [protectionAmount, setProtectionAmount] = useState(0);
  const [protectionDurationInDays, setProtectionDurationInDays] = useState(50);
  const [tokenId, setTokenId] = useState(590);

  const router = useRouter();

  return (
    <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
      <h5 className="text-left text-customGrey text-base leading-tight font-normal mb-2 flex">
        Estimated Adjusted Yields
        <div className="pl-2 items-center">
          <Tooltip 
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}                
              content="Lending Pool APY - Premium."
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
       <h1 className="text-customDarkGrey text-4xl mb-4 text-left">7 - 10%</h1>
      </div>
      <h5>
        Lending Pool APY
        <Tooltip 
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}                
            content="APY in an underlying lending protocol like Goldfinch."
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
      <p>17%</p>
      <h5>Premium</h5>
      <p>7% - 10%</p>
      <h5>CARA Token Rewards</h5>
      <p>~3.5%</p>
      <div className="flex w-72 flex-col gap-4">
        <Input
          label="Protection Amount"
          value={protectionAmount}
          type="number"
          onChange={(e) =>
            e.target.value ? setProtectionAmount(parseFloat(e.target.value)) : 0
          }
        />
        <Input
          label="Protection Duration (days)"
          value={protectionDurationInDays}
          type="number"
          onChange={(e) =>
            e.target.value
              ? setProtectionDurationInDays(parseInt(e.target.value))
              : 0
          }
        />
        <Input
          label="Goldfinch Token ID"
          value={tokenId}
          type="number"
          onChange={(e) =>
            e.target.value ? setTokenId(parseInt(e.target.value)) : 0
          }
        />
      </div>
      <h5>Premium</h5>
      <p>1,024 USDCs</p>
      <button
        type="button"
        className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
        disabled={
          protectionAmount === 0 ||
          protectionDurationInDays === 0 ||
          tokenId === 0
        }
        onClick={() => setIsOpen(true)}
      >
        Preview
      </button>
      <p>time left: 2 days 12 hours 34 mins</p>
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
  );
}
