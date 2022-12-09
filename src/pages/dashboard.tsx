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
import {
  getPoolContract,
  getPoolFactoryContract,
  getReferenceLendingPoolsContract
} from "@contracts/contractService";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import assets from "../assets";
import numeral from "numeral";
import { formatAddress } from "@utils/utils";

const Dashboard = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { contractAddresses, provider, protectionPoolService } =
    useContext(ApplicationContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");
  const { lendingPools, setLendingPools } = useContext(LendingPoolContext);
  const { protectionPools, setProtectionPools } = useContext(
    ProtectionPoolContext
  );
  const { user, setUser } = useContext(UserContext);

  const goldfinchLogo = assets.goldfinch.src;

  useEffect(() => {
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

  useEffect(() => {
    if (contractAddresses?.poolFactory && provider) {
      console.log("Fetching pools...");
      const poolFactory = getPoolFactoryContract(
        contractAddresses.poolFactory,
        provider.getSigner()
      );

      poolFactory.getPoolAddress(1).then((poolAddress) => {
        console.log("Pool address", poolAddress);

        const pool = getPoolContract(poolAddress, provider.getSigner());

        protectionPoolService
          .getSTokenUnderlyingBalance(poolAddress)
          .then((sTokenUnderlingBalance) => {
            protectionPoolService
              .getRequestedWithdrawalAmount(poolAddress)
              .then((requestedWithdrawalBalance) => {
                setUser({
                  ...user,
                  sTokenUnderlyingAmount: numeral(
                    convertUSDCToNumber(sTokenUnderlingBalance)
                  ).format(USDC_FORMAT),
                  requestedWithdrawalAmount: numeral(
                    convertUSDCToNumber(requestedWithdrawalBalance)
                  ).format(USDC_FORMAT)
                });
                console.log(
                  "sTokenUnderlingBalance ==>",
                  numeral(convertUSDCToNumber(sTokenUnderlingBalance)).format(
                    USDC_FORMAT
                  )
                );
                console.log(
                  "requestedWithdrawalBalance ==>",
                  numeral(
                    convertUSDCToNumber(requestedWithdrawalBalance)
                  ).format(USDC_FORMAT)
                );
              });
          });

        pool.getPoolInfo().then((poolInfo) => {
          console.log("Pool info", poolInfo);
          const referenceLendingPoolsContract =
            getReferenceLendingPoolsContract(
              poolInfo.referenceLendingPools,
              provider.getSigner()
            );
          referenceLendingPoolsContract
            .getLendingPools()
            .then((lendingPools) => {
              console.log("Lending pools", lendingPools);
              setLendingPools(
                lendingPools.map((lendingPool) => {
                  return {
                    address: formatAddress(lendingPool),
                    name: "Lend East #1: Emerging Asia Fintech Pool",
                    protocol: goldfinchLogo,
                    adjustedYields: "7 - 10%",
                    lendingPoolAPY: "17%",
                    CARATokenRewards: "~3.5%",
                    premium: "4 - 7%",
                    timeLeft: "59 Days 8 Hours 2 Mins",
                    protectionPoolAddress: poolAddress
                  };
                })
              );
            });
        });

        pool.totalProtection().then((totalProtection) => {
          pool.totalSTokenUnderlying().then((totalCapital) => {
            setProtectionPools([
              {
                address: poolAddress,
                protocols: goldfinchLogo,
                APY: "8 - 15%",
                totalCapital: numeral(convertUSDCToNumber(totalCapital)).format(
                  USDC_FORMAT
                ),
                totalProtection: numeral(
                  convertUSDCToNumber(totalProtection)
                ).format(USDC_FORMAT)
              }
            ]);
          });
        });
      });
    }
  }, [contractAddresses?.poolFactory]);

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
              <td>{lendingPool.address}</td>
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
              <td>{protectionPool.address}</td>
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
