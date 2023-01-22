// github does not show third commit

import { Tooltip } from "@material-tailwind/react";
import moment from "moment";
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
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import numeral from "numeral";
import { getLendingPoolName } from "@utils/forked/playground";

import assets from "src/assets";

const Portfolio = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { contractAddresses } = useContext(ApplicationContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");
  const { protectionPools } = useContext(ProtectionPoolContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

  return (
    <div className="mx-32">
      <TitleAndDescriptions title="Portfolio" buttonExist={false} />
      <h3 className="text-left font-bold">Your Protection Purchases</h3>
      <div className="rounded-2xl shadow-lg shadow-gray-200 p-8 mt-4">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th>
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Name</p>
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="The name of the underlying lending pool for which you bought protection"
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
              <th>Protocol</th>
              <th>
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Protection Amount</p>
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="The amount of protection you can get"
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

              <th>
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Protection Expires In</p>
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="Time left until this protection expires"
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
              <th>
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Premium</p>
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="The premium you have paid for this protection"
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
              {/* //todo: show this button when there is a valid claim  */}
              {/* <th>
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
              </th> */}
            </tr>
          </thead>
          <tbody>
            {user.userLendingPools.map((userLendingPool) => (
              <tr
                key={userLendingPool.lendingPoolAddress}
                className="text-left text-ms font-medium"
              >
                <td className="py-4 pr-4">
                  {getLendingPoolName(userLendingPool.lendingPoolAddress)}
                </td>
                <td className="py-4">
                  <Image
                    src={assets.goldfinch.src}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-4">
                  {numeral(
                    convertUSDCToNumber(userLendingPool.protectionAmount)
                  )
                    .format(USDC_FORMAT)
                    .toString()}
                  &nbsp;USDC
                </td>
                <td className="py-4">
                  {moment
                    .duration(
                      userLendingPool.expirationTimestamp.toNumber() -
                        moment().unix(),
                      "seconds"
                    )
                    .asDays()
                    .toFixed(0)}
                  &nbsp;days
                </td>
                <td className="py-4">
                  {numeral(
                    convertUSDCToNumber(userLendingPool.protectionPremium)
                  )
                    .format(USDC_FORMAT)
                    .toString()}
                  &nbsp;USDC
                </td>
                {/* //todo: show this button when there is a valid claim  */}
                {/* <td className="py-4">
                  <button
                    disabled
                    className="border border-customDarkGrey rounded-md text-customDarkGrey px-5 py-1 disabled:opacity-50"
                  >
                    claim
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-left font-bold mb-4 mt-16">
        Your Balance in Protection Pools
      </h3>
      <div className="rounded-2xl shadow-lg shadow-gray-200 p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th>Name</th>
              <th>Protocols</th>
              <th>Estimated APY</th>
              <th>
                <div className="flex flex-row pr-3 items-center">
                  Deposited Amount
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="Your capital in the protection pool"
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
              <th>
                <div className="flex flex-row pr-3 items-center">
                  Requested Withdrawal
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="The amount of capital you have requested to withdraw"
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
              {/* <th> */}
              {/* the div needs to be there otherwise there is a bug with styling */}
              {/* <div className="flex flex-row pr-3 items-center">
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
                </div> */}
              {/* </th> */}
              <th>
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
                <td className="pr-4 pt-4">{protectionPool.name}</td>
                <td className="pt-4">
                  <Image
                    src={protectionPool.protocols}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="pt-4">{protectionPool.APY}</td>
                <td className="pt-4">{user.sTokenUnderlyingAmount}&nbsp;USDC</td>
                <td className="pt-4">{user.requestedWithdrawalAmount}&nbsp;USDC</td>
                {/* <td>
                  <button
                    onClick={() => setIsWithdrawalRequestOpen(true)}
                    className="border border-customDarkGrey rounded-md text-customDarkGrey px-5 py-1 disabled:opacity-50"
                  >
                    Request
                  </button>
                </td> */}
                <td>
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="text-white bg-customBlue rounded-md px-12 py-4 mt-4 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        requestedWithdrawalAmount={user.requestedWithdrawalAmount}
      ></WithdrawPopUp>
    </div>
  );
};

export default Portfolio;
