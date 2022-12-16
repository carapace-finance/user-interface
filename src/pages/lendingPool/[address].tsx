import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import BuyProtectionCard from "@components/BuyProtectionCard";
import BarChart from "@components/BarChart";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import TitleAndDescriptions from "@components/TitleAndDescriptions";
import assets from "src/assets";

const LendingPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);

  let name;
  let protocol;
  let lendingPoolAddress;
  let protectionPoolAddress;

  lendingPools.map((lendingPool) => {
    if (lendingPool.address === router.query.address) {
      name = lendingPool.name;
      protocol = lendingPool.protocol;
      lendingPoolAddress = lendingPool.address;
      protectionPoolAddress = lendingPool.protectionPoolAddress;
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
      let totalCapitalNumber = totalCapital.replace(/\D/g,'');
      let totalProtectionNumber = totalProtection.replace(/\D/g,'');
      let protectionPurchaseLimitNumber = protectionPurchaseLimit.replace(/\D/g,'');
      maxAvailableProtectionAmount = protectionPurchaseLimitNumber - totalProtectionNumber;
      protectionPurchasePercentage=(totalProtectionNumber/protectionPurchaseLimitNumber)*100;
      leverageRatio=(totalCapitalNumber/totalProtectionNumber)*100;
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
            <Image src={protocol} width={40} height={40} alt="" className="mr-6" />
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${lendingPoolAddress}`}
              className=""
            >
              <Image src={assets.grayVector} width={20} height={20} alt="" className="mr-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between mx-20">
        <div className="rounded-2xl shadow-boxShadow py-6 px-5 h-80 w-600 shadow-table p-20">
          <div className="">
            <div className="text-left text-2xl">
              <div className="text-black text-2xl font-bold mb-4">Protection Purchase Details</div>
            </div>
            <p className="text-left mb-2">The maximum protection amount you can buy: {maxAvailableProtectionAmount} USDC</p>
            <div className="h-6 mb-2">
              <BarChart filledPercentage={protectionPurchasePercentage}/>
            </div>
            <div className="flex justify-between">
              <div className="text-xs leading-4 pr-20">Purchased Protection: {totalProtection}</div>
              <div className="text-xs leading-4">Protection Purchase Limit: {protectionPurchaseLimit}</div>
            </div>
          </div>
          <div>
            <div >
              <div className="text-left text-black text-2xl font-bold my-4 flex items-center">
                Leverage Ratio
                <div className="pl-2">
                  <Tooltip
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
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
            </div>
            <div className="h-6 mb-2">
              <BarChart filledPercentage={leverageRatio}/>
            </div>
            <div className="flex justify-between">
              <div className="text-xs leading-4 pr-20">Total Capital: {totalCapital}</div>
              <div className="text-xs leading-4">Purchased Protection: {totalProtection}</div>
            </div>
          </div>
        </div>
        <div className="">
          <BuyProtectionCard></BuyProtectionCard>
        </div>
      </div>
    </div>
  );
};

export default LendingPool;
