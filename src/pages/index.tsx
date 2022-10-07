import dynamic from "next/dynamic";
const LendingPools = dynamic(() => import("@components/LendingPools"), { ssr: false });

const Home = () => {
  return (
    <div>
      <LendingPools />
    </div>
  );
};

export default Home;
