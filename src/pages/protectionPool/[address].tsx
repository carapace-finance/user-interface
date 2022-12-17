import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import BarChart from "@components/BarChart";
import SellProtectionCard from "@components/SellProtectionCard";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { formatAddress } from "@utils/utils";
import TitleAndDescriptions from "@components/TitleAndDescriptions";
import assets from "src/assets";
import { Chart, ArcElement, Legend } from "chart.js";
Chart.register(ArcElement);
Chart.register(Legend);
import { Doughnut } from "react-chartjs-2";

const ProtectionPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);
  const doughnutRadius = 100;

  const handleClick = (href: string) => {
    router.push(href);
  };

  let protectionPoolAddress;
  let protocols;
  let totalCapital;
  let totalProtection;
  let depositLimit;
  let maxAvailableDepositAmount;
  let depositPercentage = 0;
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
          <div className="flex items-center ">
            <Image
              src={protocols}
              width={40}
              height={40}
              alt=""
              className="mr-6"
            />
            <a
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
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="rounded-2xl shadow-table p-8 h-full w-700">
          <div className="">
            <div className="text-left text-2xl">
              <div className="text-black text-2xl font-bold mb-4">
                Current Capital in the Pool
              </div>
            </div>
            <p className="text-left mb-2">
              The maximum amount you can deposit: {maxAvailableDepositAmount}{" "}
              USDC
            </p>
            <div className="h-6 mb-2">
              <BarChart filledPercentage={depositPercentage} />
            </div>
            <div className="flex justify-between">
              <div className="text-xs leading-4 pr-20">
                Deposited Amount: {totalCapital}
              </div>
              <div className="text-xs leading-4">
                Deposit Limit: {depositLimit}
              </div>
            </div>
          </div>
          <div>
            <div className="h-5"></div>
            <div>
              <div className="text-left text-black text-2xl font-bold my-4 flex">
                Protection Purchase Till Date
              </div>
            </div>
            <div className="w-full flex ">
              <Doughnut
                className="mx-auto"
                plugins={plugins}
                options={{
                  cutout: "70%",
                  radius: doughnutRadius,
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: {},
                      onClick: () => {}
                    }
                  },
                  elements: {
                    arc: {
                      borderAlign: "center",
                      borderWidth: 0
                    }
                  }
                }}
                data={{
                  labels: underlyingLendingPools.map((lendingPool) => {
                    const total = underlyingLendingPools
                      .map((lendingPool) =>
                        Number(
                          lendingPool.protectionPurchase.replace(/\D/g, "")
                        )
                      )
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue
                      );
                    return `${lendingPool.name} ${Math.round(
                      (Number(
                        lendingPool.protectionPurchase.replace(/\D/g, "")
                      ) /
                        total) *
                        100
                    )}%`;
                  }),
                  datasets: [
                    {
                      backgroundColor: [
                        "hsl(0, 0%, 85%)",
                        "hsl(0, 0%, %)",
                        "hsl(0, 0%, 35%)"
                      ],
                      data: underlyingLendingPools.map((lendingPool) =>
                        Number(
                          lendingPool.protectionPurchase.replace(/\D/g, "")
                        )
                      )
                    }
                  ]
                }}
              />
            </div>
          </div>
        </div>
        <SellProtectionCard></SellProtectionCard>
      </div>
      <div className="mt-16">
        <h3 className="text-left font-bold">
          Underlying Protected Lending Pools
        </h3>
        <div className="h-5"></div>
        <div className="rounded-2xl shadow-table">
          <table className="table-fixed w-full">
            <thead>
              <tr className="text-left text-sm font-bold">
                <th className="py-8 pl-8">Name</th>
                <th className="py-8">Protocol</th>
                <th className="py-8">APY</th>
                <th className="py-8">Payment Term</th>
                <th className="py-8">Opening Date</th>
              </tr>
            </thead>
            <tbody>
              {underlyingLendingPools.map((lendingPool) => (
                <tr
                  key={lendingPool.address}
                  onClick={() =>
                    handleClick(
                      `/lendingPool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`
                    )
                  }
                  className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
                >
                  <td className="py-8 pl-8">{lendingPool.name}</td>
                  <td className="py-8">
                    <Image
                      src={lendingPool.protocol}
                      width={24}
                      height={24}
                      alt=""
                    />
                  </td>
                  <td className="py-8">{lendingPool.lendingPoolAPY}</td>
                  <td className="py-8">{"TERM"}</td>
                  <td className="py-8">{"DATE"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProtectionPool;
