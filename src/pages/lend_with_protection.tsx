import dynamic from "next/dynamic";
const DashboardTable = dynamic(() => import("@components/DashboardTable"), {
  ssr: false
});

const LendWithProtection = () => {
  return (
    <div>
      <DashboardTable />
    </div>
  );
};

export default LendWithProtection;
