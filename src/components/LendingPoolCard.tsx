import { Tooltip } from "@material-tailwind/react";
import { Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function LendingPoolCard(props: any) {
  console.log(props);
  const router = useRouter();
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-200 p-3 w-full mb-5">
      <div className="flex justify-between">
        <div>
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Name
          </p>
          <p className="text-sm">{props.protectionPoolData.name}</p>
        </div>
        <div className="ml-2">
          <p className="text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Protocols
          </p>
          <Image
            src={props.protectionPoolData.protocol}
            width={24}
            height={24}
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-between mt-3 mb-4">
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            CARA Token Rewards
            <Tooltip
              className="text-xs"
              content="Lending Pool APY minus Premium"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">{props.protectionPoolData.adjustedYields}</p>
        </div>
        <div>
          <div className="flex items-center cursor-pointer justify-start text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Buy Protection Within
            <Tooltip
              className="text-xs"
              content="How much protection have been bought by all the buyers"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">{props.protectionPoolData.timeLeft}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center cursor-pointer justify-end text-xs mb-1 text-[color:var(--color-custom-grey)]">
            Estimated Premium
            <Tooltip
              className="text-xs"
              content="Estimated premium amount divided your lending amount"
              placement="top"
            >
              <Info size={12} className="ml-2" />
            </Tooltip>
          </div>
          <p className="text-sm">{props.protectionPoolData.premium}</p>
        </div>
        <div>
          <button
            className="btn-outline px-5 py-1 rounded-md"
            onClick={() =>
              // @ts-ignore
              router.push(
                `/lending-pool/${props.protectionPoolData.address}`
              )
            }
          >
            <div className="flex items-center">
              <p className="font-normal text-sm leading-6">Buy Protection</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
