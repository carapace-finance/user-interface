import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import BuyProtectionCard from "@/components/BuyProtectionCard";
import BarChart from "@/components/BarChart";
import LendingPoolCard from "@/components/LendingPoolCard";
import Skeleton from "@/components/Skeleton";
import { Info } from "lucide-react";
import { getDecimalDivFormatted, getPercentValue } from "@/utils/utils";
import { USDC_NUM_OF_DECIMALS } from "@/utils/usdc";

type Props = {
  lendingPoolData: any;
  lendingPoolFetching: boolean;
};

export default function LendingPoolPage({
  lendingPoolData,
  lendingPoolFetching
}: Props) {
  return (
    <>
      <div className="flex flex-row-reverse flex-wrap md:flex-nowrap -mt-8 md:mt-0">
        <div className="flex-1 md:basis-1/3">
          <BuyProtectionCard
            name={lendingPoolData?.name ?? ""}
            adjustedYields={1}
            lendingPoolAPY={10}
            premium={8}
            timeLeft={1200}
          />
        </div>
        <div className="flex-1 basis-full md:basis-2/3 md:mr-8 w-full">
          <h3 className="text-left font-bold mb-2 md:mb-4 mt-10 md:mt-0 text-lg md:text-2xl">
            Investment Summary
          </h3>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-card px-4 py-6 md:p-8">
              <h4 className="text-customGrey text-sm md:text-base mb-2 flex items-center">
                Estimated Premium <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-xl md:text-2xl">7%</p>
              {/* TODO: update value */}
            </div>
              {/* <h4 className="text-customGrey text-sm md:text-base mb-2 flex items-center">
                CARA Token Rewards <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-xl md:text-2xl">~3.5%</p> */}
              {/* TODO: update value */}
            <div className="rounded-2xl shadow-card px-4 py-6 md:p-8">
              <h4 className="text-customGrey text-sm md:text-base mb-2 flex items-center">
                Max Protection Amount <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-xl md:text-2xl">2,000,000 USDC</p>
              {/* TODO: update value */}
            </div>
            <div className="rounded-2xl shadow-card px-4 py-6 md:p-8">
              <h4 className="text-customGrey text-sm md:text-base mb-2 flex items-center">
                Protection Duration <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-xl md:text-2xl">90 ~ 182 Days</p>
              {/* TODO: update value */}
            </div>
          </div>
          <h3 className="font-bold mb-2 md:mb-4 mt-16 md:mt-8 text-lg md:text-2xl">
            Lending Pool Summary
          </h3>
          <div className="flex flex-col md:hidden">
            {lendingPoolFetching ? (
              <Skeleton />
            ) : (
              <span>test</span>
              // <LendingPoolCard lendingPoolData={lendingPoolData} />
            )}
          </div>
          <div className="rounded-2xl shadow-card  max-w-[calc(100vw-32px)] md:max-w-auto overflow-scroll md:overflow-auto hidden md:flex">
            <table className="table-auto">
              <thead>
                <tr className="text-left text-xs md:text-sm font-bold">
                  <th className="px-4 py-4 md:py-8 pl-4 md:pl-8 min-w-[120px] md:min-w-auto">
                    Name
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[120px] md:min-w-auto">
                    Protocol
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[70px] md:min-w-auto">
                    APY
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Payment Frequency
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Payment Term End
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Repayment Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left text-xs md:text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8">
                  <td className="px-4 py-4 md:py-8">Dummy Name</td>
                  <td className="px-4 py-4 md:py-8 min-h-[80px] md:min-h-auto flex items-center">
                    <Image
                      src={require("@/assets/goldfinch.png")}
                      width={24}
                      height={24}
                      alt={lendingPoolData?.protocol}
                      className="shrink-0"
                    />
                    <p className="ml-1">{lendingPoolData?.protocol}</p>
                  </td>
                  <td className="px-4 py-4 md:py-8">17%</td>
                  <td className="px-4 py-4 md:py-8">30 Days</td>
                  <td className="px-4 py-4 md:py-8">Apr 4, 2024</td>
                  <td className="px-4 py-4 md:py-8">Current</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-left font-bold mb-2 md:mb-4 mt-10 md:mt-8 text-lg md:text-2xl">
            Underlying Protection Pool
          </h3>
          <div className="rounded-2xl shadow-boxShadow px-4 py-6 md:p-8 w-full shadow-card">
            <h4 className="text-customGrey text-sm md:text-base mb-2 flex items-center">
              Total Value Locked <Info size={14} className="ml-1" />
            </h4>
            <p className="text-xl md:text-2xl">4,500,000 USDC</p>
          </div>
          <div className="rounded-2xl shadow-boxShadow px-4 py-6 md:p-8 w-full shadow-card">
            <div className=" text-black text-2xl bold flex justify-between mb-2 md:mb-4">
              <div className="flex items-center">
                <h4 className="text-left text-base md:text-xl">
                  Leverage Ratio
                </h4>
                <div className="pl-2">
                  <Tooltip
                    content="Percentage of capital that is available to cover potential payouts"
                    placement="top"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 md:w-6 h-4 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </Tooltip>
                </div>
              </div>
              <p className="text-left text-xl md:text-2xl">{61.23} %</p>
            </div>
            <div className="h-6 mb-4">
              <BarChart filledPercentage={61.23} />
            </div>
            <div className="flex justify-between  text-xs md:text-sm">
              <p className="pr-0 md:pr-20">
                Total Protection Pool Balance:{" "}
                {lendingPoolFetching ? (
                  <Skeleton />
                ) : (
                  <span>
                    {getDecimalDivFormatted(
                      lendingPoolData?.totalProtection ?? "0",
                      USDC_NUM_OF_DECIMALS,
                      0
                    )}
                    &nbsp;USDC
                  </span>
                )}
              </p>
              <p className="text-right">
                Total Purchased Protection: 1,000&nbsp;USDC
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
