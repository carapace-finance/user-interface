import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import BuyProtectionCard from "@components/BuyProtectionCard";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { formatAddress } from "@utils/utils";

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
    <div>
      <div>
        {name}
        {formatAddress(router.query.address)}
      </div>
      <Image src={protocol} width={24} height={24} alt="" />
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://etherscan.io/address/${lendingPoolAddress}`}
      >
        link
      </a>
      <div>
        <h1>Lending Pool Details</h1>
        <h3>Protection Purchase Details</h3>
        <h4>Protection Purchase Limit: {purchaseLimit}</h4>
        <div>{totalProtection}</div>
        <h3>
          Leverage Ratio
          <Tooltip content="test test" placement="top">
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
        </h3>
        <div>{totalCapital}</div>
        <div>{totalProtection}</div>
      </div>
      <BuyProtectionCard></BuyProtectionCard>
    </div>
  );
};

export default LendingPool;
