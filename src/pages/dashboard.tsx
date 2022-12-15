import { Tooltip } from "@material-tailwind/react";
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
import moment from "moment";

const Dashboard = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { contractAddresses, provider, protectionPoolService } =
    useContext(ApplicationContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);
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
                const formattedUnderlyingBalance = numeral(
                  convertUSDCToNumber(sTokenUnderlyingBalance)
                ).format(USDC_FORMAT);
                const formattedWithdrawalBalance = numeral(
                  convertUSDCToNumber(requestedWithdrawalBalance)
                ).format(USDC_FORMAT);
                setUser({
                  ...user,
                  sTokenUnderlyingAmount: formattedUnderlyingBalance,
                  requestedWithdrawalAmount: formattedWithdrawalBalance
                });
                console.log(
                  "sTokenUnderlingBalance ==>",
                  formattedUnderlyingBalance
                );
                console.log(
                  "requestedWithdrawalBalance ==>",
                  formattedWithdrawalBalance
                );
              });
          });

        (async () => {
          const protectionPurchases =
            await protectionPoolService.getProtectionPurchases(poolAddress);
          console.log(
            "Retrieved Protection Purchases ==>",
            protectionPurchases
          );
          setUser({
            ...user,
            protectionPurchases: protectionPurchases
          });
        })();
      });
    }
  }, [protectionPools]);

  const getTimeUntilExpiration = (lendingPool) => {
    let timeUntilExpirationInSeconds = moment().unix() + 1854120; // "21 Days 11 Hours 2 Mins" from now;
    if (user?.protectionPurchases?.length > 0) {
      user.protectionPurchases.map((protection) => {
        if (
          protection.purchaseParams.lendingPoolAddress === lendingPool.address
        ) {
          timeUntilExpirationInSeconds = protection.startTimestamp
            .add(protection.purchaseParams.protectionDurationInSeconds)
            .toNumber();
        }
      });
    }

    // TODO: need to figure out how to display hours and minutes
    return moment
      .duration(timeUntilExpirationInSeconds - moment().unix(), "seconds")
      .humanize();
  };

  return (
    <div className="px-2.5">
      <div className="h-5"></div>
      <TitleAndDescriptions title="Dashboard" buttonExist={false} />
      <div className="h-10"></div>
      <h3 className="text-left font-bold">Protection Purchases</h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-sm font-bold">
              <th >Address</th>
              <th >Lending Pool</th>
              <th>Protocol</th>
              <th className="flex flex-row justify-between mr-3">
                Adjusted Yields
                <Tooltip content="test test" placement="top">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#6E7191"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </th>
              <th className="text-left">Lending Pool APY</th>
              <th>CARA Token Rewards</th>
              <th>Premium</th>
              <th>Time Until Expiration</th>
              <th className="flex flex-row justify-between" >
                Claim
                <Tooltip content="test test" placement="top">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#6E7191"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {/*  TODO: use User.protectionPurchases */}
            {lendingPools.map((lendingPool) => (
              <tr key={lendingPool.address} className="text-left text-sm font-medium">
                <td className="pt-2">{formatAddress(lendingPool.address)}</td>
                <td >{lendingPool.name}</td>
                <td>
                  <Image
                    src={lendingPool.protocol}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td>{lendingPool.adjustedYields}</td>
                <td >{lendingPool.lendingPoolAPY}</td>
                <td>{lendingPool.CARATokenRewards}</td>
                <td>{lendingPool.premium}</td>
                <td>{getTimeUntilExpiration(lendingPool)}</td>
                <td>
                  <button disabled>claim</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-10"></div>
      <h3 className="text-left font-bold">Deposits</h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table p-8">

        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-sm font-bold">
              {/* <th>address</th> */}
              <th>Protocols</th>
              <th className="flex flex-row justify-between pr-3">
                Estimated APY
                <Tooltip content="test test" placement="top">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#6E7191"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </th>
              <th>Total Capital</th>
              <th>Total Protection</th>
              <th>Deposited Amount</th>
              <th>Requested Withdrawal</th>
              <th >
                {/* the div needs to be there otherwise there is a bug */}
                <div className="flex flex-row justify-between pr-3">
                  Request Withdrawal
                  <Tooltip content="test test" placement="top">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#6E7191"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </Tooltip>
                </div>
              </th>
              <th className="flex flex-row justify-between pr-3">
                Withdraw
                <Tooltip content="test test" placement="top">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#6E7191"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {protectionPools.map((protectionPool) => (
              <tr key={protectionPool.address} className="text-left text-sm font-medium">
                {/* <td>{formatAddress(protectionPool.address)}</td> */}
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
      </div>
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
