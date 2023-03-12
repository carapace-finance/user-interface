import dynamic from "next/dynamic";
const TitleAndDescriptions = dynamic(
  () => import("@/components/TitleAndDescriptions"),
  { ssr: false }
);
import AllLendingPools from "@components/tables/AllLendingPools";
import LendingPoolCard from "@/components/LendingPoolCard";
import { useContext } from "react";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";

const BuyProtection = () => {
  const { lendingPools } = useContext(LendingPoolContext);
  return (
    <main className="container mx-auto px-4">
      <TitleAndDescriptions
        title="Protect"
        descriptions="Buy protection for your lending pools to hedge against default risks"
        buttonExist={true}
        button="Learn about buying protection"
        guideLink="https://www.carapace.finance/docs/protocol-mechanics/protection_buyers"
      />
      <h3 className="text-left font-bold mb-7">All Lending Pools</h3>
      <div className="flex flex-col md:hidden">
        {lendingPools.map((lendingPool, index) => (
          <LendingPoolCard key={index} protectionPoolData={lendingPool} />
        ))}
      </div>
      <div className="rounded-2xl shadow-lg shadow-gray-200 hidden md:flex">
        <AllLendingPools />
      </div>
    </main>
  );
};

export default BuyProtection;
