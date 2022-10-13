import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});

const Dashboard = () => {
  return (
    <div>
      <Table title="Protection Purchases" />
      <Table title="Deposits" />
    </div>
  );
};

export default Dashboard;
