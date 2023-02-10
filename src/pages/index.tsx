import dynamic from "next/dynamic";
const SellProtection = dynamic(() => import("./sell-protection"), {
  ssr: false
});

const Home = () => {
  return <SellProtection />;
};

export default Home;
