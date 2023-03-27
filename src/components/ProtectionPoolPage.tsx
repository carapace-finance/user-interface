import dynamic from "next/dynamic";
import BarChart from "@/components/BarChart";
import { secondsToDays, getCurrentCycleEnd } from "@/utils/date";
import Skeleton from "@/components/Skeleton";
import useQueryLendingPools from "@/hooks/useQueryLendingPools";
import { getDecimalDivFormatted, getPercentValue } from "@/utils/utils";
import { USDC_NUM_OF_DECIMALS } from "@/utils/usdc";

const SellProtectionCard = dynamic(
  () => import("@components/SellProtectionCard"),
  {
    ssr: false
  }
);
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, ChartTooltip, Legend);
import { Info } from "lucide-react";

type Props = {
  protectionPoolData: any;
  protectionPoolFetching: boolean;
};

export default function ProtectionPoolPage({
  protectionPoolData,
  protectionPoolFetching
}: Props) {
  const {
    data: lendingPoolsData,
    fetching: lendingPoolsFetching,
    error: lendingPoolsError
  } = useQueryLendingPools();

  const doughnutRadius = 100;

  const handleClick = (lendingPoolAddress: string) => {
    window.open(
      `https://app.goldfinch.finance/pools/${lendingPoolAddress}`,
      "_blank"
    );
  };

  const tvlRatio: string = protectionPoolFetching
    ? "0.00"
    : getPercentValue(
        protectionPoolData?.totalSTokenUnderlying,
        protectionPoolData?.totalProtection
      );

  return (
    <>
      <div className="flex md:flex-row-reverse flex-wrap md:flex-nowrap -mt-16 md:mt-0">
        <div className="flex-1 md:basis-1/3">
          <SellProtectionCard protectionPoolAddress={protectionPoolData?.id} />
        </div>
        <div className="flex-1 basis-full md:basis-2/3 md:mr-8 w-full">
          <h3 className="text-left font-bold mb-2 md:mb-4 mt-10 md:mt-0 text-lg md:text-2xl">
            Investment Summary
          </h3>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-card p-4 md:p-8">
              <h4 className="text-customGrey text-sm md:text-base mb-1 md:mb-2 flex items-center">
                Total Estimated APY <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-lg md:text-2xl">18 - 25 %</p>
              {/* TODO: update value */}
              <div className="grid grid-cols-2 gap-3 md:gap-6 border-t border-gray-300 mt-3 md:mt-4 pt-3 md:pt-4">
                <div>
                  <h5 className="text-customGrey text-xs md:text-sm mb-1 md:mb-2 inline">
                    Yields from Premium
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-1 md:mt-2">10 - 15%</p>{" "}
                  {/* TODO: update value */}
                </div>
                <div>
                  <h5 className="text-customGrey text-xs md:text-sm mb-1 md:mb-2 inline">
                    CARA Token Rewards
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-1 md:mt-2">8 - 10%</p>{" "}
                  {/* TODO: update value */}
                </div>
              </div>
            </div>
            <div className="rounded-2xl shadow-card p-4 md:p-8">
              <h4 className="text-customGrey text-sm md:text-base mb-1 md:mb-2 flex items-center">
                Minumum Locking Period
                <Info size={14} className="ml-1" />
              </h4>
              <p className="text-lg md:text-2xl">
                {protectionPoolFetching ? (
                  <Skeleton />
                ) : (
                  secondsToDays(
                    protectionPoolData?.minProtectionDurationInSeconds ?? 0
                  )
                )}{" "}
                Days
              </p>
              <div className="grid grid-cols-2 gap-0 md:gap-6 border-t border-gray-300 mt-3 md:mt-4 pt-3 md:pt-4">
                <div>
                  <h5 className="text-customGrey text-xs md:text-sm mb-1 md:mb-2 inline">
                    Cycle Duration
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-1 md:mt-2">
                    {protectionPoolFetching ? (
                      <Skeleton />
                    ) : (
                      secondsToDays(protectionPoolData?.cycleDuration ?? 0)
                    )}{" "}
                    Days
                  </p>
                </div>
                <div className="-ml-2 md:ml-0">
                  <h5 className="text-customGrey text-xs md:text-sm mb-1 md:mb-2 inline">
                    The Current Cycle Ends In
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-1 md:mt-2">
                    {/* TODO: update this max ** days format, not month */}
                    {protectionPoolFetching ? (
                      <Skeleton />
                    ) : (
                      getCurrentCycleEnd(
                        protectionPoolData?.currentCycleStartTime ?? 0,
                        protectionPoolData?.cycleDuration ?? 0
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="font-bold mb-4 mt-16 md:mt-8 text-lg md:text-2xl">
            Protection Pool Summary
          </h3>
          <h4 className="font-bold mb-2 text-customGrey text-base md:text-xl">
            Total Value Locked
          </h4>
          <div className="mb-4 rounded-2xl px-4 py-6 md:p-6 shadow-card">
            {protectionPoolFetching ? (
              <Skeleton />
            ) : (
              <>
                <div className="flex justify-between mb-1">
                  <p className="text-sm md:text-base">
                    {getDecimalDivFormatted(
                      protectionPoolData.totalSTokenUnderlying,
                      USDC_NUM_OF_DECIMALS,
                      0
                    )}{" "}
                    USDC
                  </p>
                  <p className="text-sm md:text-base">{tvlRatio} %</p>
                </div>
                <BarChart filledPercentage={Number(tvlRatio)} />
              </>
            )}{" "}
          </div>
          <h4 className="font-bold mb-2 md:mb-4 mt-10 md:mt-0 text-customGrey text-base md:text-xl">
            Protection Distribution Across Lending Pools
          </h4>
          <div className="rounded-2xl shadow-card p-4 md:p-8 w-full">
            {/* TODO: update */}
            {/* <Doughnut
              className="mx-auto"
              data={{
                labels: underlyingLendingPools.map((lendingPool) => {
                  const total = underlyingLendingPools
                    .map((lendingPool) =>
                      Number(lendingPool.protectionPurchase.replace(/\D/g, ""))
                    )
                    .reduce(
                      (accumulator, currentValue) => accumulator + currentValue
                    );
                  return `${lendingPool.name} ${Math.round(
                    (Number(lendingPool.protectionPurchase.replace(/\D/g, "")) /
                      total) *
                      100
                  )}%`;
                }),
                datasets: [
                  {
                    label: "Purchase Protection Balance in USDC",
                    data: underlyingLendingPools.map((lendingPool) =>
                      Number(lendingPool.protectionPurchase.replace(/\D/g, ""))
                    ),
                    backgroundColor: ["#B8B8B8", "#14142B", "#F8F0E3"]
                  }
                ]
              }}
              options={{
                // This chart will only respond to mousemove and not on click.
                events: ["mousemove"]
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-left font-bold mb-2 md:mb-4 mt-16 md:mt-8 text-lg md:text-2xl">
          Underlying Lending Pools
        </h3>
        {lendingPoolsFetching ? (
          <Skeleton />
        ) : (
          <div className="rounded-2xl shadow-card  max-w-[calc(100vw-32px)] md:max-w-auto overflow-scroll md:overflow-auto">
            <table className="table-auto">
              <thead>
                <tr className="text-left text-xs md:text-sm font-bold">
                  <th className="px-4 py-4 md:py-8 pl-4 md:pl-8 min-w-[150px] md:min-w-auto">
                    Lending Pool Name
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Borrower Name
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[120px] md:min-w-auto">
                    Protocol
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[100px] md:min-w-auto">
                    Geography
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[100px] md:min-w-auto">
                    Currency
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Outstanding Loans
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Outstanding Capital from Junior Tranche
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Full Repayment Due
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Payment Frequency
                  </th>
                  <th className="px-4 py-4 md:py-8 min-w-[150px] md:min-w-auto">
                    Junior Tranche APY
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* TODO: update */}
                {/* {lendingPoolsData.map((lendingPool) => (
                  <tr
                    key={lendingPool.address}
                    onClick={() =>
                      handleClick(lendingPool.address.toLowerCase())
                    }
                    className="text-left text-xs md:text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
                  >
                    <td className="px-4 py-4 md:py-8 pl-8">
                      {lendingPool.name}
                    </td>
                    <td className="px-4 py-4 md:py-8 pl-8">
                      {lendingPool.borrowerName}
                    </td>
                    <td className="px-4 py-4 md:py-8 min-h-[80px] md:min-h-auto flex items-center">
                      <Image
                        src={lendingPool.protocol}
                        width={24}
                        height={24}
                        alt=""
                      />
                      <p className="ml-1">{lendingPool.protocolName}</p>
                    </td>
                    <td className="px-4 py-4 md:py-8">
                      {lendingPool.geography}
                    </td>
                    <td className="px-4 py-4 md:py-8">
                      {lendingPool.currency}
                    </td>
                    <td className="px-4 py-4 md:py-8">$19,951,738</td>
                    <td className="px-4 py-4 md:py-8">$3,990,347</td>
                    <td className="px-4 py-4 md:py-8">Apr 4, 2024</td>
                    <td className="px-4 py-4 md:py-8">30 Days</td>
                    <td className="px-4 py-4 md:py-8">
                      {lendingPool.lendingPoolAPY}
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs mt-6 mx-2">
          *<a className="underline">Talk to us</a> if you want to gain access to
          more information about the lending pools and borrowers above.
        </p>
      </div>
    </>
  );
}
