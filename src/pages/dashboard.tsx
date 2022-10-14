import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const Dashboard = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Dashboard"
        buttonExist={false}
      />
      <Table title="Protection Purchases" />
      <Table title="Deposits" />
    </div>
  );
};

export default Dashboard;
