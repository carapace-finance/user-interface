import dynamic from "next/dynamic";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import AllLendingPools from "@components/tables/AllLendingPools";

const BuyProtection = () => {
  return (
    <main className="container mx-auto px-4">
      <TitleAndDescriptions
        title="Protect"
        descriptions="Buy protection for your lending pools to hedge against default risks"
        buttonExist={true}
        button="Learn about buying protection"
        guideLink="https://www.carapace.finance/docs/protocol-mechanics/protection_buyers"
      />
      <h3 className="text-left font-bold">All Lending Pools</h3>
      <div className="h-5" />
      <div className="rounded-2xl shadow-lg shadow-gray-200">
        <div className="h-4"></div>
        <AllLendingPools />
      </div>
    </main>
  );
};

export default BuyProtection;
