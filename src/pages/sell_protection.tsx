import dynamic from "next/dynamic";
const DashboardTable = dynamic(() => import("@components/DashboardTable"), {
  ssr: false
});

const SellProtection = () => {
  return (
    <div>
      <DashboardTable />
    </div>
  );
};

export default SellProtection;
