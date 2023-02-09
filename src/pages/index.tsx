import dynamic from "next/dynamic";
const BuyProtection = dynamic(() => import("./buy-protection"), { ssr: false });

const Home = () => {
  return <BuyProtection />;
};

export default Home;
