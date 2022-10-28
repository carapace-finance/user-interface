import dynamic from "next/dynamic";
import Link from "next/link";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const bonds = [
  {
    poolTokenId: 424,
    price: "2542 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: "Goldfinch"
  },
  {
    poolTokenId: 4224,
    price: "42424242 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: "Goldfinch"
  },
  {
    poolTokenId: 342,
    price: "42424242 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: "Goldfinch"
  },
  {
    poolTokenId: 424,
    price: "900000 USDC",
    lendingPool: "Almavest Basket #6",
    protocol: "Goldfinch"
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
          </tr>
        </thead>
        <tbody>
          {bonds.map((bond) => (
            <tr>
              <td>{bond.poolTokenId}</td>
              <td>{bond.price}</td>
              <td>{bond.lendingPool}</td>
              <td>{bond.protocol}</td>
              <td>
                <Link
                  key={bond.poolTokenId}
                  href={"/bond/" + bond.poolTokenId}
                >
                  <a>link</a>
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
