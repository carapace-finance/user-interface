import dynamic from "next/dynamic";
import Link from "next/link";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const protectionPools = [
  {
    id: 1,
    protocol: "Goldfinch",
    APY: "15 - 20%"
  },
  {
    id: 2,
    protocol: "Goldfinch",
    APY: "15 - 20%"
  },
  {
    id: 3,
    protocol: "Goldfinch",
    APY: "15 - 20%"
  },
  {
    id: 4,
    protocol: "Goldfinch",
    APY: "15 - 20%"
  }
];

const SellProtection = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Sell Protection"
        descriptions="Earn yields by depositing capital to diversified protection pools you think are safe."
        buttonExist={true}
        button="Learn about selling protection"
      />
      <div>All Protection Pools</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>Protocol</th>
            <th>APY</th>
          </tr>
        </thead>
        <tbody>
          {protectionPools.map((protectionPool) => (
            <tr>
              <td>{protectionPool.id}</td>
              <td>{protectionPool.protocol}</td>
              <td>{protectionPool.APY}</td>
              <td>
                <Link
                  key={protectionPool.id}
                  href={"/protectionPool/" + protectionPool.id}
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

export default SellProtection;
