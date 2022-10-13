import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});

const SellProtection = () => {
  return (
    <div>
      <Table title="All Protection Pools" />
    </div>
  );
};

export default SellProtection;
