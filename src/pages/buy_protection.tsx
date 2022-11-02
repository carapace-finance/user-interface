import dynamic from "next/dynamic";
import Link from "next/link";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const lendingPools = [
  {
    id: 1,
    name: "Lending Pool #1",
    protocol: "Goldfinch",
    adjustedYields: "7 - 10%"
  },
  {
    id: 2,
    name: "Lending Pool #1",
    protocol: "Goldfinch",
    adjustedYields: "7 - 10%"
  },
  {
    id: 3,
    name: "Lending Pool #1",
    protocol: "Goldfinch",
    adjustedYields: "7 - 10%"
  },
  {
    id: 4,
    name: "Lending Pool #1",
    protocol: "Goldfinch",
    adjustedYields: "7 - 10%"
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
            <th>Lending Pool</th>
            <th>Protocols</th>
            <th>Adjusted Yields</th>
          </tr>
        </thead>
        <tbody>
          {lendingPools.map((lendingPool) => (
            <tr>
              <td>{lendingPool.id}</td>
              <td>{lendingPool.name}</td>
              <td>{lendingPool.protocol}</td>
              <td>{lendingPool.adjustedYields}</td>
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
