import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import WithdrawalRequestPopUp from "@components/WithdrawalRequestPopUp";
import WithdrawPopUp from "@components/WithdrawPopUp";
import { ContractAddressesContext } from "@contexts/ContractAddressesProvider";

const protectionPurchases = [
  {
    id: 1,
    name: "Lending Pool #1",
    protocol: "Goldfinch",
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%",
    timeUntilExpiration: "7 Days 8 Hours 2 Mins"
  },
  {
    id: 2,
    name: "Lending Pool #1",
    protocol: "Goldfinch",
    adjustedYields: "7 - 10%",
    lendingPoolAPY: "17%",
    CARATokenRewards: "~3.5%",
    premium: "4 - 7%",
    timeUntilExpiration: "7 Days 8 Hours 2 Mins"
  }
];

const deposits = [
  {
    id: 1,
    protocol: "Goldfinch",
    APY: "15 - 20%",
    totalCapital: "$1,803,000",
    totalProtection: "$2,203,000",
    depositedAmount: "$203,000",
    requestedWithdrawal: "$203,000"
  },
  {
    id: 2,
    protocol: "Goldfinch",
    APY: "15 - 20%",
    totalCapital: "$1,803,000",
    totalProtection: "$2,203,000",
    depositedAmount: "$203,000",
    requestedWithdrawal: "$203,000"
  }
];

const Dashboard = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { contractAddresses } = useContext(ContractAddressesContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");

  useEffect(() => { 
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

  return (
    <div>
      <TitleAndDescriptions title="Dashboard" buttonExist={false} />
      <h3 className="text-left">Protection Purchases</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>Lending Pool</th>
            <th>Protocol</th>
            <th>Adjusted Yields</th>
            <th>Lending Pool APY</th>
            <th>CARA Token Rewards</th>
            <th>Premium</th>
            <th>Time Until Expiration</th>
            <th>Claim</th>
          </tr>
        </thead>
        <tbody>
          {protectionPurchases.map((protectionPurchase) => (
            <tr key={protectionPurchase.id}>
              <td>{protectionPurchase.id}</td>
              <td>{protectionPurchase.name}</td>
              <td>{protectionPurchase.protocol}</td>
              <td>{protectionPurchase.adjustedYields}</td>
              <td>{protectionPurchase.lendingPoolAPY}</td>
              <td>{protectionPurchase.CARATokenRewards}</td>
              <td>{protectionPurchase.premium}</td>
              <td>{protectionPurchase.timeUntilExpiration}</td>
              <td>
                <button>claim</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-left">Deposits</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>Protocols</th>
            <th>APY</th>
            <th>Total Capital</th>
            <th>Total Protection</th>
            <th>Deposited Amount</th>
            <th>Requested Withdrawal</th>
            <th>Request Withdrawal</th>
            <th>Withdraw</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
              <td>{deposit.id}</td>
              <td>{deposit.protocol}</td>
              <td>{deposit.APY}</td>
              <td>{deposit.totalCapital}</td>
              <td>{deposit.totalProtection}</td>
              <td>{deposit.depositedAmount}</td>
              <td>{deposit.requestedWithdrawal}</td>
              <td>
                <button onClick={() => setIsWithdrawalRequestOpen(true)}>
                  request withdrawal
                </button>
              </td>
              <td>
                <button onClick={() => setIsWithdrawOpen(true)}>
                  withdraw
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <WithdrawalRequestPopUp
        open={isWithdrawalRequestOpen}
        onClose={() => setIsWithdrawalRequestOpen(false)}
        protectionPoolAddress={protectionPoolAddress}
      ></WithdrawalRequestPopUp>
      <WithdrawPopUp
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      ></WithdrawPopUp>
    </div>
  );
};

export default Dashboard;
