import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import BuyProtectionCard from "@components/BuyProtectionCard";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { formatAddress } from "@utils/utils";
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
  let purchaseLimit;
  protectionPools.map((protectionPool) => {
    if (protectionPool.address === protectionPoolAddress) {
      totalCapital = protectionPool.totalCapital;
      totalProtection = protectionPool.totalProtection;
      purchaseLimit = protectionPool.protectionPurchaseLimit;
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
              <img
                src={assets.footerLogo.src}
                alt="carapace"
                className="w-[40px]"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="rounded-2xl shadow-boxShadow py-6 px-5 h-64 w-600">
          <div className="">
            <div className="text-left text-2xl">
              <div className=" text-black text-2xl font-bold mb-4">Protection Purchase Details</div>
            </div>
            <div className="h-6 bg-gray-500 mb-2">
              グラフが入ります
            </div>
            <div className="flex justify-between">
              <div className="text-xs leading-4 pr-20">Purchased Protection: {totalProtection}</div>
              <div className="text-xs leading-4">Protection Purchase Limit: {purchaseLimit}</div>
            </div>
          </div>
          <div className="下段">
            <div >
              <div className="text-left text-black text-2xl font-bold my-4 flex">
                Leverage Ratio
                <div className="pl-2 items-center">
                  <Tooltip 
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}                
                      content="the total capital in the pool divided by the total protection amount."
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
            <div className="h-6 bg-gray-500 mb-2">
              グラフが入ります
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
