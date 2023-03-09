import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext } from "react";
import BarChart from "@/components/BarChart";

// import SellProtectionCard from "@components/SellProtectionCard";
const SellProtectionCard = dynamic(
  () => import("@components/SellProtectionCard"),
  {
    ssr: false
  }
);
import { LendingPoolContext } from "@/contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@/contexts/ProtectionPoolContextProvider";
import TitleAndDescriptions from "@/components/TitleAndDescriptions";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, ChartTooltip, Legend);
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import numeral from "numeral";
import { Info, ExternalLink } from "lucide-react";

const ProtectionPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);
  const doughnutRadius = 100;

  // const { provider } = useContext(ApplicationContext);
  // const prevProvider = useRef(provider);
  // useEffect(() => {
  //   if (prevProvider.current !== provider) {
  //     router.push("/sellProtection");
  //     prevProvider.current = provider;
  //   }
  // }, [provider]);

  const handleClick = (lendingPoolAddress: string) => {
    window.open(
      `https://app.goldfinch.finance/pools/${lendingPoolAddress}`,
      "_blank"
    );
  };

  let protectionPoolAddress;
  let protocols;
  let totalCapital;
  let totalProtection;
  let depositLimit;
  let maxAvailableDepositAmount;
  let depositPercentage = 0;
  let estimatedAPY;
  protectionPools.map((protectionPool) => {
    if (protectionPool.address === router.query.address) {
      protectionPoolAddress = protectionPool.address;
      protocols = protectionPool.protocols;
      totalCapital = protectionPool.totalCapital;
      totalProtection = protectionPool.totalProtection;
      depositLimit = protectionPool.depositLimit;
      let totalCapitalNumber = totalCapital.replace(/\D/g, "");
      let depositLimitNumber = depositLimit.replace(/\D/g, "");
      maxAvailableDepositAmount = depositLimitNumber - totalCapitalNumber;
      depositPercentage = (totalCapitalNumber / depositLimitNumber) * 100;
      estimatedAPY = protectionPool.APY;
    }
  });
  const underlyingLendingPools = lendingPools.filter(
    (lendingPool) => lendingPool.protectionPoolAddress === protectionPoolAddress
  );

  const plugins = [
    {
      id: "title",
      beforeDraw: (chart: any) => {
        const width = chart.width;
        const ctx = chart.ctx;
        ctx.restore();
        const fontSize = (doughnutRadius / 100).toFixed(2);
        ctx.font = `bold ${fontSize}em sans-serif`;
        ctx.textBaseline = "top";
        const text = totalCapital;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        ctx.fillText(text, textX, doughnutRadius);
        ctx.save();
      }
    }
  ];

  return (
    <main className="container mx-auto px-4">
      <div className="w-full">
        <div className="-mt-4 mb-4 text-sm text-customGrey">
          <Link href="/">Earn</Link> &gt; Goldfinch Protection Pool #1
        </div>
        <div className="flex">
          <TitleAndDescriptions
            title={
              <h1 className="inline items-center flex-wrap text-left font-bold leading-12 text-4xl mb-6">
                Goldfinch Protection Pool #1
                <Image
                  src={protocols}
                  width={40}
                  height={40}
                  alt=""
                  className="ml-6 inline"
                />
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://etherscan.io/address/${protectionPoolAddress}`}
                  className="ml-3 text-customGrey"
                >
                  <ExternalLink size={20} className="inline" />
                </a>
              </h1>
            }
            descriptions=""
            buttonExist={false}
          />
        </div>
      </div>
      <div className="flex flex-row-reverse flex-wrap md:flex-nowrap">
        <div className="flex-1 md:basis-1/3 px-4">
          <SellProtectionCard />
        </div>
        <div className="flex-1 md:basis-2/3 px-4">
          <h3 className="text-left font-bold mb-4 mt-8">Investiment Summary</h3>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-customGrey text-base mb-2 flex items-center">
                Total Estimated APY <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-2xl">18 - 25 %</p>
              {/* TODO: update value */}
              <div className="grid grid-cols-2 gap-6 border-t border-gray-300 mt-4 pt-4">
                <div>
                  <h5 className="text-customGrey text-sm mb-2 inline">
                    Yields from Premium
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-2">10 - 15%</p> {/* TODO: update value */}
                </div>
                <div>
                  <h5 className="text-customGrey text-sm mb-2 inline">
                    CARA Token Rewards
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-2">8 - 10%</p> {/* TODO: update value */}
                </div>
              </div>
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-customGrey text-base mb-2 flex items-center">
                Minumum Locking Period
                <Info size={14} className="ml-1" />
              </h4>
              <p className="text-2xl">95 Days</p>
              {/* TODO: update value */}
              <div className="grid grid-cols-2 gap-6 border-t border-gray-300 mt-4 pt-4">
                <div>
                  <h5 className="text-customGrey text-sm mb-2 inline">
                    Cycle Duration
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-2">90 Days</p> {/* TODO: update value */}
                </div>
                <div>
                  <h5 className="text-customGrey text-sm inline">
                    The Current Cycle Ends In
                    <Info size={14} className="ml-1 inline" />
                  </h5>
                  <p className="mt-2">5 Days</p> {/* TODO: update value */}
                </div>
              </div>
            </div>
          </div>
          <h3 className="font-bold mb-4 mt-8">Protection Pool Summary</h3>
          <h4 className="font-bold mb-2 text-customGrey">Total Value Locked</h4>
          <div className="mb-4 rounded-2xl p-6 shadow-lg shadow-gray-200">
            <div className="flex justify-between mb-1">
              <p>4,500,000 USDC</p>
              {/*  TODO: update value */}
              <p>64.2 %</p>
            </div>
            <BarChart filledPercentage={64.2} />
          </div>
          <h4 className="font-bold mb-4 text-customGrey">
            Protection Distribution Across Lending Pools
          </h4>
          <div className="rounded-2xl shadow-lg shadow-gray-200 p-8 w-full">
            <Doughnut
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
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-left font-bold mb-4 mt-8">
          Underlying Lending Pools
        </h3>
        <div className="rounded-2xl shadow-lg shadow-gray-200">
          <table className="table-auto">
            <thead>
              <tr className="text-left text-sm font-bold">
                <th className="px-4 py-8 pl-8">Lending Pool Name</th>
                <th className="px-4 py-8">Borrower Name</th>
                <th className="px-4 py-8">Protocol</th>
                <th className="px-4 py-8">Geography</th>
                <th className="px-4 py-8">Currency</th>
                <th className="px-4 py-8">Outstanding Loans</th>
                <th className="px-4 py-8">
                  Outstanding Capital from Junior Tranche
                </th>
                <th className="px-4 py-8">Full Repayment Due</th>
                <th className="px-4 py-8">Payment Frequency</th>
                <th className="px-4 py-8">Junior Tranche APY</th>
              </tr>
            </thead>
            <tbody>
              {underlyingLendingPools.map((lendingPool) => (
                <tr
                  key={lendingPool.address}
                  onClick={() => handleClick(lendingPool.address.toLowerCase())}
                  className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
                >
                  <td className="px-4 py-8 pl-8">{lendingPool.name}</td>
                  <td className="px-4 py-8 pl-8">{lendingPool.borrowerName}</td>
                  <td className="px-4 py-8 flex itms-center">
                    <Image
                      src={lendingPool.protocol}
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="ml-1">{lendingPool.protocolName}</p>
                  </td>
                  <td className="px-4 py-8">{lendingPool.geography}</td>
                  <td className="px-4 py-8">{lendingPool.currency}</td>
                  <td className="px-4 py-8">$19,951,738</td>
                  <td className="px-4 py-8">$3,990,347</td>
                  <td className="px-4 py-8">Apr 4, 2024</td>
                  <td className="px-4 py-8">30 Days</td>
                  <td className="px-4 py-8">{lendingPool.lendingPoolAPY}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-6 mx-2">
          *<a className="underline">Talk to us</a> if you want to gain access to
          more information about the lending pools and borrowers above.
        </p>
      </div>
    </main>
  );
};

export default ProtectionPool;
