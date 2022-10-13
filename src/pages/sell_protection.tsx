import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const SellProtection = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Sell Protection"
        descriptions="Earn yields by depositing capital to diversified protection pools you think are safe. "
      />

      <Table title="All Protection Pools" />
    </div>
  );
};

export default SellProtection;
