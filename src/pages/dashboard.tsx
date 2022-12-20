// github does not show third commit

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
import moment from "moment";

const Dashboard = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { contractAddresses } = useContext(ApplicationContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

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
    <div className="mx-32">
      <div className="h-5"></div>
      <TitleAndDescriptions title="Dashboard" buttonExist={false} />
      <h3 className="text-left font-bold">Your Protection Purchases</h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th className="py-4">Name</th>
              <th className="py-4">Protocol</th>
              <th className="py-4">Premium</th>
              <th className="text-left py-4">Lending Pool APY</th>
              <th className="py-4">
                <div className="flex flex-row justify-between mr-4">
                  Estimated Adjusted Yields
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="Lending Pool APY % minus Premium %"
                    placement="top"
                  >
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
              <th className="py-4">Protection expires in</th>
              <th className="py-4">Protection Amount</th>
              <th className="py-4">
                <div className="flex flex-row items-center">
                  Claim
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="You can claim a payout when the underlying lending pool defaults."
                    placement="top"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#6E7191"
                      className="w-5 h-5 ml-4"
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
            </tr>
          </thead>
          <tbody>
            {/*  TODO: use User.protectionPurchases */}
            {lendingPools.map((lendingPool) => (
              <tr
                key={lendingPool.address}
                className="text-left text-ms font-medium"
              >
                <td className="py-4">{lendingPool.name}</td>
                <td className="py-4">
                  <Image
                    src={lendingPool.protocol}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-4">{lendingPool.premium}</td>
                <td>{lendingPool.lendingPoolAPY}</td>
                <td className="py-4">{lendingPool.adjustedYields}</td>
                <td className="py-4">{getTimeUntilExpiration(lendingPool)}</td>
                <td className="py-4">{user.protectionAmount}</td>
                <td className="py-4">
                  <button
                    disabled
                    className="border border-customDarkGrey rounded-md text-customDarkGrey px-5 py-1 disabled:opacity-50"
                  >
                    claim
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-16"></div>
      <h3 className="text-left font-bold mb-8">Your Deposits</h3>
      <div className="rounded-2xl shadow-table p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th className="py-4">Name</th>
              <th className="py-4">Protocols</th>
              <th className="py-4">
                <div className="flex flex-row justify-between pr-3">
                  Estimated APY
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="Estimated APY for protection sellers."
                    placement="top"
                  >
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
              <th className="py-4">Total Capital</th>
              <th className="py-4">Total Protection</th>
              <th className="py-4">Deposited Amount</th>
              <th className="py-4">Requested Withdrawal</th>
              <th className="py-4">
                {/* the div needs to be there otherwise there is a bug with styling */}
                <div className="flex flex-row pr-3 items-center">
                  Request Withdrawal
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="You can make a request to withdraw your capital in the next cycle."
                    placement="top"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#6E7191"
                      className="w-5 h-5 "
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
              <th className="py-4">
                <div className="flex flex-row pr-3 items-center">
                  Withdraw
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="You can withdraw the requested withdrawal amount."
                    placement="top"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#6E7191"
                      className="w-5 h-5 ml-4"
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
            </tr>
          </thead>
          <tbody>
            {/* todo: list up the protection pools the user has interacted with */}
            {protectionPools.map((protectionPool) => (
              <tr
                key={protectionPool.address}
                className="text-left text-ms font-medium"
              >
                <td>{protectionPool.name}</td>
                <td className="py-4">
                  <Image
                    src={protectionPool.protocols}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-4">{protectionPool.APY}</td>
                <td className="py-4">{protectionPool.totalCapital} </td>
                <td className="py-4">{protectionPool.totalProtection} </td>
                <td className="py-4">{user.sTokenUnderlyingAmount}</td>
                <td className="py-4">{user.requestedWithdrawalAmount}</td>
                <td className="py-4">
                  <button
                    onClick={() => setIsWithdrawalRequestOpen(true)}
                    className="border border-customDarkGrey rounded-md text-customDarkGrey px-5 py-1 disabled:opacity-50"
                  >
                    Request
                  </button>
                </td>
                <td className="py-4">
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="border border-customDarkGrey rounded-md text-customDarkGrey px-5 py-1 disabled:opacity-50"
                  >
                    Withdraw
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
