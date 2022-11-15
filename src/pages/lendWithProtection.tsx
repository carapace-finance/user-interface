import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import assets from "../assets";

const goldfinchLogo = assets.goldfinch.src;

const bonds = [
  {
    poolTokenId: 424,
    price: "2542 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%"
  },
  {
    poolTokenId: 4224,
    price: "42424242 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%"
  },
  {
    poolTokenId: 342,
    price: "42424242 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%"
  },
  {
    poolTokenId: 424,
    price: "900000 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: goldfinchLogo,
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%"
  }
];

const LendWithProtection = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Lend with Protection"
        descriptions="Earn adjusted yields by purchasing bonds with protection."
        buttonExist={true}
        button="Learn about lending with protection"
      />
      <div>All Bonds with Protection</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Pool Token Id</th>
            <th>Bond Price</th>
            <th>Lending Pool</th>
            <th>Protocol</th>
            <th>Adjusted Yields</th>
            <th>Lending Pool APY</th>
            <th>CARA Token Rewards</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          {bonds.map((bond) => (
            <tr key={bond.poolTokenId}>
              <td>{bond.poolTokenId}</td>
              <td>{bond.price}</td>
              <td>{bond.lendingPool}</td>
              <td>
                <Image src={bond.protocol} width={24} height={24} alt="" />
              </td>
              <td>{bond.adjustedYields}</td>
              <td>{bond.lendingPoolAPY}</td>
              <td>{bond.CARATokenRewards}</td>
              <td>{bond.premium}</td>
              <td>
                <Link key={bond.poolTokenId} href={"/bond/" + bond.poolTokenId}>
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

export default LendWithProtection;
