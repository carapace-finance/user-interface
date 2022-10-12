import dynamic from "next/dynamic";
const DashboardTable = dynamic(() => import("@components/DashboardTable"), {
  ssr: false
});

const BuyProtection = () => {
  return (
    <div>
      <DashboardTable />
    </div>
  );
};

export default BuyProtection;
