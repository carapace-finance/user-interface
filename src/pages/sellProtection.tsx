import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Link from "next/link";
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
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const SellProtection = () => {
  const { contractAddresses } = useContext(ApplicationContext);
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");

  const router = useRouter();

  const { protectionPools } = useContext(ProtectionPoolContext);
  const { user, setUser } = useContext(UserContext);
  const handleClick = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

  return (
    <div className="mx-32">
      <TitleAndDescriptions
        title="Sell Protection"
        descriptions="Earn yields by depositing capital to diversified protection pools"
        buttonExist={true}
        button="Learn about selling protection"
        guideLink="https://docs.google.com/document/d/1-wp-gBIVkwrzN0u-eRY78u9rDGZsSCTFsj9xSfB8NJw"
      />

<h3 className="text-left font-bold mb-8">Your Protection Pools with Deposit</h3>
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
      <h3 className="text-left font-bold mb-8 mt-16">All Protection Pools</h3>
      <div className="rounded-2xl shadow-table">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-sm font-bold">
              <th className="py-8 pl-8">Name</th>
              <th className="py-8">Protocols</th>
              <th className="py-8">
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Estimated APY</p>
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
              <th className="py-8">Total Capital</th>
              <th className="py-8">Total Protection</th>
            </tr>
          </thead>
          <tbody>
            {protectionPools.map((protectionPool) => (
              <tr
                key={protectionPool.address}
                onClick={() =>
                  handleClick(`/protectionPool/${protectionPool.address}`)
                }
                className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50"
              >
                <td className="py-8 pl-8">{protectionPool.name}</td>
                <td className="py-8">
                  <Image
                    src={protectionPool.protocols}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-8">{protectionPool.APY}</td>
                <td className="py-8">{protectionPool.totalCapital}</td>
                <td className="py-8">{protectionPool.totalProtection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellProtection;
