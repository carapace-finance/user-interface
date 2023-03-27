import { getLendingPoolName } from "@/utils/playground/playground";
import { convertUSDCToNumber, USDC_FORMAT } from "@/utils/usdc";
import { Tooltip } from "@material-tailwind/react";
import { Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import assets from "src/assets";
import numeral from "numeral";
import { unixtimeDiffFromNow } from "@/utils/date";

export default function RequestedWithdrawalCard(props: any) {
  const router = useRouter();
  return (
    <div className="rounded-2xl shadow-card p-3 w-full mb-5">
      <div className="flex justify-between">
        <div>
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Name
          </p>
          <p className="text-sm">
            {getLendingPoolName(
              props.requestedWithdrawalData.lendingPoolAddress
            )}
          </p>
        </div>
        <div className="ml-3">
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Protocols
          </p>
          <Image src={assets.goldfinch.src} width={24} height={24} alt="" />
        </div>
      </div>
      <div className="flex justify-between mt-3 mb-4">
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Protection Amount
            <Tooltip
              className="text-xs"
              content="The amount of protection you can get"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {numeral(
              convertUSDCToNumber(
                props.requestedWithdrawalData.protectionAmount
              )
            )
              .format(USDC_FORMAT)
              .toString()}
            &nbsp;USDC
          </p>
        </div>
        <div>
          <div className="flex items-center cursor-pointer justify-start text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Protection Expires In
            <Tooltip
              className="text-xs"
              content="Time left until this protection expires"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {unixtimeDiffFromNow(
              props.requestedWithdrawalData.expirationTimestamp.toNumber()
            )}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center cursor-pointer justify-start text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Premium
            <Tooltip
              className="text-xs"
              content="The premium you have paid for this protection"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {numeral(
              convertUSDCToNumber(
                props.requestedWithdrawalData.protectionPremium
              )
            )
              .format(USDC_FORMAT)
              .toString()}
            &nbsp;USDC
          </p>
        </div>
        <div>
          {/* <button
            className="btn-outline px-5 py-1 rounded-md"
            onClick={() =>
              // @ts-ignore
              router.push(
                `/lending-pool/${props.protectionPoolData.address}`
              )
            }
          >
            <div className="flex items-center">
              <p className="font-normal text-sm leading-6">Renew</p>
            </div>
          </button> */}
        </div>
      </div>
    </div>
  );
}
