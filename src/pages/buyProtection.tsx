import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import assets from "../assets";

const goldfinchLogo = assets.goldfinch.src;

const lendingPools = [
  {
    id: 1,
    name: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%",
    timeLeft: "7 Days 8 Hours 2 Mins"
  },
  {
    id: 2,
    name: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%",
    timeLeft: "7 Days 8 Hours 2 Mins"
  },
  {
    id: 3,
    name: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%",
    timeLeft: "7 Days 8 Hours 2 Mins"
  },
  {
    id: 4,
    name: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%",
    timeLeft: "7 Days 8 Hours 2 Mins"
  }
];

const BuyProtection = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Buy Protection"
        descriptions="Buy protection for your loans to hedge against default risks."
        buttonExist={true}
        button="Learn about buying protection"
      />
      <div>All Lending Pools</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Protocol </th>
            <th>Adjusted Yields</th>
            <th>Lending Pool APY</th>
            <th>CARA Token Rewards</th>
            <th>Premium</th>
            <th>Time Left</th>
          </tr>
        </thead>
        <tbody>
          {lendingPools.map((lendingPool) => (
            <tr key={lendingPool.id}>
              <td>{lendingPool.id}</td>
              <td>{lendingPool.name}</td>
              <td>
                <Image
                  src={lendingPool.protocol}
                  width={24}
                  height={24}
                  alt=""
                />
              </td>
              <td>{lendingPool.adjustedYields}</td>
              <td>{lendingPool.lendingPoolAPY}</td>
              <td>{lendingPool.CARATokenRewards}</td>
              <td>{lendingPool.premium}</td>
              <td>{lendingPool.timeLeft}</td>
              <td>
                <Link
                  key={lendingPool.id}
                  href={"/lendingPool/" + lendingPool.id}
                >
                  link
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyProtection;
