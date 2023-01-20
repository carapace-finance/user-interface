import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import BarChart from "@components/BarChart";
import SellProtectionCard from "@components/SellProtectionCard";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import TitleAndDescriptions from "@components/TitleAndDescriptions";
import assets from "src/assets";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import numeral from "numeral";

const ProtectionPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);
  const doughnutRadius = 100;

  const { provider } = useContext(ApplicationContext);
  const prevProvider = useRef(provider);
  useEffect(() => {
    if (prevProvider.current !== provider) {
      router.push("/sellProtection");
      prevProvider.current = provider;
    }
  }, [provider]);

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
    <div className="mx-32">
      <div className="flex">
        <TitleAndDescriptions
          title={`Goldfinch Protection Pool #1`}
          descriptions=""
          buttonExist={false}
        />
        <div className="ml-3">
          <div className="flex items-center">
            <Image
              src={protocols}
              width={40}
              height={40}
              alt=""
              className="mr-6"
            />
            {/* todo: enable the link once we deploy our protection pool to the mainney */}
            {/* <a
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${protectionPoolAddress}`}
              className=""
            >
              <Image
                src={assets.grayVector}
                width={18}
                height={18}
                alt=""
                className="mr-6"
              />
            </a> */}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex justify-between">
            <div className="rounded-2xl shadow-lg shadow-gray-200 shadow-gray-200 p-8 w-fit">
              <h4 className="text-left mb-4">Total Protection Pool Balance</h4>
              <p className="text-left font-bold">{totalCapital}&nbsp;</p>
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8 w-fit ml-8">
              <h4 className="text-left mb-4">
                Total Protection Pool Balance Limit
              </h4>
              <p className="text-left font-bold">{depositLimit}&nbsp;</p>
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
                    onClick={() => handleClick(lendingPool.address.toLowerCase())}
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
                    backgroundColor: ["#161C2E", "#6E7191", "#14142B"]
                  }
                ]
              }}
            />
          </div>
        </div>
        <SellProtectionCard estimatedAPY={estimatedAPY}></SellProtectionCard>
      </div>
      {/* <p className="text-left mb-2">
              The maximum amount you can deposit:
              {numeral(maxAvailableDepositAmount).format(0.0) + " USDC"}
            </p>
            <div className="h-6 mb-2">
              <BarChart filledPercentage={depositPercentage} />
            </div> */}
    </div>
  );
};

export default ProtectionPool;
