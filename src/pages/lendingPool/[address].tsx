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
  protectionPools.map((protectionPool) => {
    if (protectionPool.address === protectionPoolAddress) {
      totalCapital = protectionPool.totalCapital;
      totalProtection = protectionPool.totalProtection;
    }
  });

  return (
    <div>
      <div>
        {name}{formatAddress(router.query.address)}
      </div>
      <Image src={protocol} width={24} height={24} alt="" />
      <a href={`https://etherscan.io/address/${lendingPoolAddress}`}>link</a>
      <div>
        <h1>Lending Pool Details</h1>
        <h3>Protection Purchase Details</h3>
        <div>{totalProtection}</div>
        <h3>Leverage Ratio</h3>
        <div>{totalCapital}</div>
        <div>{totalProtection}</div>
      </div>
      <BuyProtectionCard></BuyProtectionCard>
    </div>
  );
};

export default LendingPool;
