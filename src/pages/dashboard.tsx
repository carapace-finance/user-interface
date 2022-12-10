import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import WithdrawalRequestPopUp from "@components/WithdrawalRequestPopUp";
import WithdrawPopUp from "@components/WithdrawPopUp";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import numeral from "numeral";
import { formatAddress } from "@utils/utils";

const Dashboard = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { contractAddresses, provider, protectionPoolService } =
    useContext(ApplicationContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(
    ProtectionPoolContext
  );
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

  useEffect(() => {
    if (protectionPools && protectionPoolService) {
      protectionPools.map((protectionPool) => {
        const poolAddress = protectionPool.address;
        protectionPoolService
          .getSTokenUnderlyingBalance(poolAddress)
          .then((sTokenUnderlyingBalance) => {
            protectionPoolService
              .getRequestedWithdrawalAmount(poolAddress)
              .then((requestedWithdrawalBalance) => {
                const formattedUnderlyingBalance = numeral(convertUSDCToNumber(sTokenUnderlyingBalance)).format(USDC_FORMAT);
                const formattedWithdrawalBalance = numeral(convertUSDCToNumber(requestedWithdrawalBalance)).format(USDC_FORMAT);
                setUser({
                  ...user,
                  sTokenUnderlyingAmount: formattedUnderlyingBalance,
                  requestedWithdrawalAmount: formattedWithdrawalBalance,
                });
                console.log("sTokenUnderlingBalance ==>", formattedUnderlyingBalance);
                console.log("requestedWithdrawalBalance ==>", formattedWithdrawalBalance);
              });
          });
      });
    }
  }, [protectionPools]);

  return (
    <div>
      <TitleAndDescriptions title="Dashboard" buttonExist={false} />
      <h3 className="text-left">Protection Purchases</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>address</th>
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
          {lendingPools.map((lendingPool) => (
            <tr key={lendingPool.address}>
              <td>{formatAddress(lendingPool.address)}</td>
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
              <td>timeUntilExpiration</td>
              <td>
                <button disabled>claim</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-left">Deposits</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>address</th>
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
          {protectionPools.map((protectionPool) => (
            <tr key={protectionPool.address}>
              <td>{formatAddress(protectionPool.address)}</td>
              <td>
                <Image
                  src={protectionPool.protocols}
                  width={24}
                  height={24}
                  alt=""
                />
              </td>
              <td>{protectionPool.APY}</td>
              <td>{protectionPool.totalCapital} USDC</td>
              <td>{protectionPool.totalProtection} USDC</td>
              <td>{user.sTokenUnderlyingAmount} USDC</td>
              <td>{user.requestedWithdrawalAmount} USDC</td>
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
        protectionPoolAddress={protectionPoolAddress}
      ></WithdrawPopUp>
    </div>
  );
};

export default Dashboard;
