import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});

const BuyProtection = () => {
  return (
    <div>
      <Table title="All Lending Pools" />
    </div>
  );
};

export default BuyProtection;
