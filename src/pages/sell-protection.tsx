import dynamic from "next/dynamic";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import AllProtectionPools from "@/components/tables/AllProtectionPools";
import ProtectionPoolCard from "@/components/ProtectionPoolCard";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { useContext } from "react";
import useQueryProtectionPools from "@/hooks/useQueryProtectionPools";
import Skeleton from "@/components/Skeleton";

const SellProtection = () => {
  const { protectionPools } = useContext(ProtectionPoolContext);
  const { data, fetching, error } = useQueryProtectionPools();

  return (
    <main className="container mx-auto px-4">
      <TitleAndDescriptions
        title="Earn"
        descriptions="Earn yields by depositing capital to diversified protection pools"
        buttonExist={true}
        button="Learn about selling protection"
        guideLink="https://www.carapace.finance/docs/protocol-mechanics/protection_sellers"
      />
      <h3 className="text-left font-medium mb-8">All Protection Pools</h3>
      {fetching ? (
        <Skeleton height={80} />
      ) : (
        <>
          <div className="flex md:hidden">
            {protectionPools.map((protectionPool, index) => (
              <ProtectionPoolCard
                key={index}
                protectionPoolData={protectionPool}
              />
            ))}
          </div>
          <div className="rounded-2xl shadow-card hidden md:flex">
            <AllProtectionPools pools={data} />
          </div>
        </>
      )}
    </main>
  );
};

export default SellProtection;
