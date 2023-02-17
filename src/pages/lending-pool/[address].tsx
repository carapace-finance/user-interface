import { Tooltip } from "@material-tailwind/react";
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
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { ArrowUpRight } from "lucide-react";

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
    <div className="mx-32">
      <div className="flex">
        <TitleAndDescriptions
          title={name}
          descriptions=""
          buttonExist={false}
        />
        <div className="ml-3">
          <div className="flex items-center ">
            <Image
              src={protocol}
              width={40}
              height={40}
              alt=""
              className="mr-6"
            />
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`https://etherscan.io/address/${lendingPoolAddress}`}
              className=""
            >
              <ArrowUpRight size={16} className="ml-1" />
              {/* <Image
                src={assets.grayVector}
                width={20}
                height={20}
                alt=""
                className="mr-6"
              /> */}
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex justify-between">
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8 w-fit">
              <h4 className="text-left mb-4">Total Purchased Protection</h4>
              <p className="text-left font-bold">{totalProtection}&nbsp;USDC</p>
            </div>
            <div className="rounded-2xl shadow-lg shadow-gray-200 p-8 w-fit ml-8">
              <h4 className="text-left mb-4">
                Total Protection Purchase Limit
              </h4>
              <p className="text-left font-bold">
                {protectionPurchaseLimit}&nbsp;USDC
              </p>
            </div>
          </div>
          <div className="rounded-2xl shadow-boxShadow py-8 px-8 mt-8 h-fit w-fit shadow-lg shadow-gray-200">
            <div className=" text-black text-2xl bold flex justify-between">
              <div className="flex">
                <h4 className="text-left mb-4">Leverage Ratio</h4>
                <div className="pl-2">
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
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
        <BuyProtectionCard
          name={name}
          adjustedYields={adjustedYields}
          lendingPoolAPY={lendingPoolAPY}
          premium={premium}
          timeLeft={timeLeft}
        ></BuyProtectionCard>
      </div>
      {/* <p className="text-left text-base mb-2">
            The maximum protection amount you can buy:{" "}
            {maxAvailableProtectionAmount} USDC
          </p>
          <div className="h-6 mb-2">
            <BarChart filledPercentage={protectionPurchasePercentage} />
          </div> */}
    </div>
  );
};

export default LendingPool;
