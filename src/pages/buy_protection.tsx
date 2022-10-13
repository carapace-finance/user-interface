import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const BuyProtection = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Buy Protection"
        descriptions="Buy protection for your loans to hedge against default risks."
      />

      <Table title="All Lending Pools" />
    </div>
  );
};

export default BuyProtection;
