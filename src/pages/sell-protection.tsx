import dynamic from "next/dynamic";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import AllProtectionPools from "@components/tables/AllProtectionPools";

const SellProtection = () => {
  return (
    <main className="container mx-auto px-4">
      <TitleAndDescriptions
        title="Earn"
        descriptions="Earn yields by depositing capital to diversified protection pools"
        buttonExist={true}
        button="Learn about selling protection"
        guideLink="https://www.carapace.finance/docs/protocol-mechanics/protection_sellers"
      />
      <h3 className="text-left font-bold mb-8">All Protection Pools</h3>
      <div className="rounded-2xl shadow-lg shadow-gray-200">
        <AllProtectionPools />
      </div>
    </main>
  );
};

export default SellProtection;
