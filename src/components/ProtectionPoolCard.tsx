import { Tooltip } from "@material-tailwind/react";
import { Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function ProtectionPoolCard(props: any) {
  const router = useRouter();
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-200 p-3 w-full">
      <div className="flex justify-between">
        <div>
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Name
          </p>
          <p className="text-sm">{props.protectionPoolData.name}</p>
        </div>
        <div>
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Protocols
          </p>
          <Image
            src={props.protectionPoolData.protocols}
            width={24}
            height={24}
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-between mt-3 mb-4">
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Total Pool Balance
            <Tooltip
              className="text-xs"
              content="How much capital have been deposited to this pool"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {props.protectionPoolData.totalCapital} USDC
          </p>
        </div>
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Total Pool Protection
            <Tooltip
              className="text-xs"
              content="How much protection have been bought by all the buyers"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">
            {props.protectionPoolData.totalProtection} USDC
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Estimated APY
            <Tooltip
              className="text-xs"
              content="Estimated APY excluding token rewards"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">{props.protectionPoolData.APY}</p>
        </div>
        <div>
          <button
            className="btn-outline px-5 py-1 rounded-md"
            onClick={() =>
              // @ts-ignore
              router.push(
                `/protection-pool/${props.protectionPoolData.address}`
              )
            }
          >
            <div className="flex items-center">
              <p className="font-normal text-sm leading-6">Deposit</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
