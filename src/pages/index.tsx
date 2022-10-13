import dynamic from "next/dynamic";
const BuyProtection = dynamic(() => import("./buy_protection"), { ssr: false });

const Home = () => {
  return (
    <div>
      <BuyProtection />
    </div>
  );
};

export default Home;
