import dynamic from "next/dynamic";
const BuyProtection = dynamic(() => import("./buyProtection"), { ssr: false });

const Home = () => {
  return (
    <div>
      <BuyProtection />
    </div>
  );
};

export default Home;
