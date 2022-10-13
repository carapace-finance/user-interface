import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});

const LendWithProtection = () => {
  return (
    <div>
      <Table title="All Bonds with Protection" />
    </div>
  );
};

export default LendWithProtection;
