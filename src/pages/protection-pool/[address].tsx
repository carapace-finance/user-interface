import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
// import SellProtectionCard from "@components/SellProtectionCard";
const SellProtectionCard = dynamic(
  () => import("@components/SellProtectionCard"),
  {
    ssr: false
  }
);
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import TitleAndDescriptions from "@components/TitleAndDescriptions";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import numeral from "numeral";
import { ExternalLink } from "lucide-react";

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
              <h1 className="inline-flex items-center flex-wrap text-left font-bold leading-12 text-4xl mb-6">
                Goldfinch Protection Pool #1
                <Image
                  src={protocols}
                  width={40}
                  height={40}
                  alt=""
                  className="ml-6"
                />
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://etherscan.io/address/${protectionPoolAddress}`}
                  className="ml-3 text-customGrey"
                >
                  <ExternalLink size={20} />
                </a>
              </h1>
            }
            descriptions=""
            buttonExist={false}
          />
        </div>
      </div>
      <div className="flex flex-row-reverse flex-wrap md:flex-nowrap">
        <div className="flex-1 md:basis-1/3">
          <SellProtectionCard estimatedAPY={estimatedAPY}></SellProtectionCard>
          {/* <p className="text-left mb-2">
              The maximum amount you can deposit:
              {numeral(maxAvailableDepositAmount).format(0.0) + " USDC"}
            </p>
            <div className="h-6 mb-2">
              <BarChart filledPercentage={depositPercentage} />
            </div> */}
        </div>
        <div className="flex-1 md:basis-2/3">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-left mb-4">Total Protection Pool Balance</h4>
              <p className="text-left font-bold">{totalCapital}&nbsp;USDC</p>
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-left mb-4">
                Total Protection Pool Balance Limit
              </h4>
              <p className="text-left font-bold">{depositLimit}&nbsp;USDC</p>
            </div>
          </div>
          <h3 className="text-left font-bold mb-4 mt-8">
            Underlying Protected Lending Pools
          </h3>
          <div className="rounded-2xl shadow-lg shadow-gray-200">
            <table className="table-auto">
              <thead>
                <tr className="text-left text-sm font-bold">
                  <th className="px-4 py-8 pl-8">Name</th>
                  <th className="px-4 py-8">Protocol</th>
                  <th className="px-4 py-8">APY</th>
                  <th className="px-4 py-8">Payment Frequency</th>
                  <th className="px-4 py-8">Payment Term End</th>
                </tr>
              </thead>
              <tbody>
                {underlyingLendingPools.map((lendingPool) => (
                  <tr
                    key={lendingPool.address}
                    onClick={() =>
                      handleClick(lendingPool.address.toLowerCase())
                    }
                    className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
                  >
                    <td className="px-4 py-8 pl-8">{lendingPool.name}</td>
                    <td className="px-4 py-8">
                      <Image
                        src={lendingPool.protocol}
                        width={24}
                        height={24}
                        alt=""
                      />
                    </td>
                    <td className="px-4 py-8">{lendingPool.lendingPoolAPY}</td>
                    <td className="px-4 py-8">30 Days</td>
                    <td className="px-4 py-8">Apr 4, 2024</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-left font-bold mt-8 mb-4">
            Protection Distribution Across Lending Pools
          </h3>
          <div className="rounded-2xl shadow-lg shadow-gray-200 p-8 w-700">
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
    </main>
  );
};

export default ProtectionPool;
