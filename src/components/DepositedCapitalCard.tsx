import { Tooltip } from "@material-tailwind/react";
import { Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function DepositedCapitalCard(props: any) {
  return (
    <div className="rounded-2xl shadow-card p-3 w-full mb-5">
      <div className="flex justify-between">
        <div>
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Name
          </p>
          <p className="text-sm">{props.depositedCapitalData.name}</p>
        </div>
        <div className="ml-3">
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Protocols
          </p>
          <Image
            src={props.depositedCapitalData.protocols}
            width={24}
            height={24}
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-between mt-4 mb-5">
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Estimated APY
          </div>
          <p className="text-sm">{props.depositedCapitalData.APY}</p>
        </div>
        <div>
          <div className="flex items-center cursor-pointer justify-start text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Deposited Amount
            <Tooltip
              className="text-xs"
              content="Your capital in the protection pool"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {props.userData.sTokenUnderlyingAmount}&nbsp;USDC
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center cursor-pointer justify-start text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Requested Withdrawal
            <Tooltip
              className="text-xs"
              content="The amount of capital you have requested to withdraw"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {props.userData.requestedWithdrawalAmount}&nbsp;USDC
          </p>
        </div>
        <div>
          <button
            className="text-white bg-customBlue rounded-md px-10 py-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => props.setIsWithdrawOpen(true)}
          >
            <div className="flex items-center">
              <p className="font-normal text-sm leading-6">Withdraw</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
