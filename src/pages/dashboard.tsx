import dynamic from "next/dynamic";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const protectionPurchases = [
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
  }
];

const deposits = [
  {
    id: 1,
    protocol: "Goldfinch",
    APY: "15 - 20%"
  },
  {
    id: 2,
    protocol: "Goldfinch",
    APY: "15 - 20%"
  }
];

const Dashboard = () => {
  return (
    <div>
      <TitleAndDescriptions title="Dashboard" buttonExist={false} />
      <div>Protection Purchases</div>
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
          {protectionPurchases.map((protectionPurchase) => (
            <tr key={protectionPurchase.id}>
            <td>{protectionPurchase.id}</td>
              <td>{protectionPurchase.name}</td>
              <td>{protectionPurchase.protocol}</td>
              <td>{protectionPurchase.adjustedYields}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Deposits</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>Protocol</th>
            <th>APY</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
            <td>{deposit.id}</td>
              <td>{deposit.protocol}</td>
              <td>{deposit.APY}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
