import { Tooltip } from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useContext, useEffect, useRef } from "react";
import BuyProtectionCard from "@components/BuyProtectionCard";
import BarChart from "@components/BarChart";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import TitleAndDescriptions from "@components/TitleAndDescriptions";
import assets from "src/assets";
import ProtectionPoolDetail from "@/components/tables/ProtectionPoolDetail";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { ExternalLink, Info } from "lucide-react";

const LendingPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);

  const { provider } = useContext(ApplicationContext);
  const prevProvider = useRef(provider);
  useEffect(() => {
    if (prevProvider.current !== provider) {
      router.push("/buyProtection");
      prevProvider.current = provider;
    }
  }, [provider]);

  let name;
  let protocol;
  let lendingPoolAddress;
  let protectionPoolAddress;
  let adjustedYields;
  let lendingPoolAPY;
  let premium;
  let timeLeft;
  lendingPools.map((lendingPool) => {
    if (lendingPool.address === router.query.address) {
      name = lendingPool.name;
      protocol = lendingPool.protocol;
      lendingPoolAddress = lendingPool.address;
      protectionPoolAddress = lendingPool.protectionPoolAddress;
      adjustedYields = lendingPool.adjustedYields;
      lendingPoolAPY = lendingPool.lendingPoolAPY;
      premium = lendingPool.premium;
      timeLeft = lendingPool.timeLeft;
    }
  });

  let totalCapital;
  let totalProtection;
  let protectionPurchaseLimit;
  let maxAvailableProtectionAmount;
  let protectionPurchasePercentage = 0;
  let leverageRatio = 0;
  protectionPools.map((protectionPool) => {
    if (protectionPool.address === protectionPoolAddress) {
      totalCapital = protectionPool.totalCapital;
      totalProtection = protectionPool.totalProtection;
      protectionPurchaseLimit = protectionPool.protectionPurchaseLimit;
      let totalCapitalNumber = totalCapital.replace(/\D/g, "");
      let totalProtectionNumber = totalProtection.replace(/\D/g, "");
      let protectionPurchaseLimitNumber = protectionPurchaseLimit.replace(
        /\D/g,
        ""
      );
      maxAvailableProtectionAmount =
        protectionPurchaseLimitNumber - totalProtectionNumber;
      protectionPurchasePercentage =
        (totalProtectionNumber / protectionPurchaseLimitNumber) * 100;
      leverageRatio = (totalCapitalNumber / totalProtectionNumber) * 100;
    }
  });

  return (
    <main className="container mx-auto px-4">
      <div className="w-full">
        <div className="-mt-4 mb-4 text-sm text-customGrey">
          <Link href="/buy-protection">Protect</Link> &gt; Lend East #1:
          Emerging Asia Fintech Pool
        </div>
        <TitleAndDescriptions
          title={
            <h1 className="inline items-center flex-wrap text-left font-bold leading-12 text-4xl mb-6">
              {name}
              <Image
                src={protocol}
                width={40}
                height={40}
                alt=""
                className="ml-6 inline"
              />
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={`https://etherscan.io/address/${lendingPoolAddress}`}
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
      <div className="flex flex-row-reverse flex-wrap md:flex-nowrap">
        <div className="flex-1 md:basis-1/3 px-4">
          <BuyProtectionCard
            name={name}
            adjustedYields={adjustedYields}
            lendingPoolAPY={lendingPoolAPY}
            premium={premium}
            timeLeft={timeLeft}
          />
        </div>
        <div className="flex-1 md:basis-2/3 px-4">
          <h3 className="text-left font-bold mb-4 mt-8">Investiment Summary</h3>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-customGrey text-base mb-2 flex items-center">
                Estimated Premium <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-2xl">7%</p>
              {/* TODO: update value */}
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-customGrey text-base mb-2 flex items-center">
                CARA Token Rewards <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-2xl">~3.5%</p>
              {/* TODO: update value */}
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-customGrey text-base mb-2 flex items-center">
                Max Protection Amount <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-2xl">2,000,000 USDC</p>
              {/* TODO: update value */}
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
              <h4 className="text-customGrey text-base mb-2 flex items-center">
                Protection Duration <Info size={14} className="ml-1" />
              </h4>
              <p className="text-left text-2xl">90 ~ 182 Days</p>
              {/* TODO: update value */}
            </div>
          </div>
          <h3 className="font-bold mb-4 mt-8">Lending Pool Summary</h3>
          <div className="rounded-2xl shadow-lg shadow-gray-200">
            <table className="table-auto">
              <thead>
                <tr className="text-left text-sm font-bold">
                  <th className="px-4 py-8 pl-8">Name</th>
                  <th className="px-4 py-8">Protocol</th>
                  <th className="px-4 py-8">APY</th>
                  <th className="px-4 py-8">Payment Frequency</th>
                  <th className="px-4 py-8">Payment Term End</th>
                  <th className="px-4 py-8">Repayment Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-8">{name}</td>
                  <td className="px-4 py-8 inline-flex">
                    <Image
                      src={protocol}
                      width={24}
                      height={24}
                      alt=""
                      className="shrink-0"
                    />
                    <p className="ml-1">Goldfinch</p>
                  </td>
                  <td className="px-4 py-8">17%</td>
                  <td className="px-4 py-8">30 Days</td>
                  <td className="px-4 py-8">Apr 4, 2024</td>
                  <td className="px-4 py-8">Current</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-left font-bold mb-4 mt-8">
            Underlying Protection Pool
          </h3>
          <div className="rounded-2xl shadow-boxShadow py-8 px-8 w-full shadow-lg shadow-gray-200">
            <h4 className="text-customGrey text-base mb-2 flex items-center">
              Total Value Locked <Info size={14} className="ml-1" />
            </h4>
            <p className="text-2xl">4,500,000 USDC</p>
          </div>
          <div className="rounded-2xl shadow-boxShadow py-8 px-8 w-full shadow-lg shadow-gray-200">
            <div className=" text-black text-2xl bold flex justify-between">
              <div className="flex">
                <h4 className="text-left mb-4">Leverage Ratio</h4>
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
                      className="w-6 h-6"
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
              <p className="text-left mb-4">
                {numeral(leverageRatio).format("0,0.0")}%
              </p>
            </div>
            <div className="h-6 mb-4">
              <BarChart filledPercentage={leverageRatio} />
            </div>
            <div className="flex justify-between  text-sm">
              <p className="pr-20">
                Total Protection Pool Balance: {totalCapital}&nbsp;USDC
              </p>
              <p>Total Purchased Protection: {totalProtection}&nbsp;USDC</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LendingPool;
