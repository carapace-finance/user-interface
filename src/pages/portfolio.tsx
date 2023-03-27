// github does not show third commit

import { Tooltip } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@/components/TitleAndDescriptions"),
  { ssr: false }
);
import WithdrawalRequestPopUp from "@/components/WithdrawalRequestPopUp";
import WithdrawPopUp from "@/components/WithdrawPopUp";
import RenewProtectionPopUp from "@/components/RenewProtectionPopUp";
import { ApplicationContext } from "@/contexts/ApplicationContextProvider";
import { ProtectionPoolContext } from "@/contexts/ProtectionPoolContextProvider";
import { UserContext } from "@/contexts/UserContextProvider";
import { convertUSDCToNumber, USDC_FORMAT } from "@/utils/usdc";
import numeral from "numeral";
import { getLendingPoolName } from "@/utils/playground/playground";
import { Info } from "lucide-react";

import assets from "src/assets";
import { CircularProgress, Skeleton } from "@mui/material";
import { unixtimeDiffFromNow } from "@utils/date";
import ProtectionPurchasesCard from "@/components/ProtectionPurchasesCard";
import DepositedCapitalCard from "@/components/DepositedCapitalCard";
import RequestedWithdrawalCard from "@/components/RequestedWithdrawalCard";

const Portfolio = () => {
  const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isRenewProtectionOpen, setIsRenewProtectionOpen] = useState(false);
  const { contractAddresses } = useContext(ApplicationContext);
  const [protectionPoolAddress, setProtectionPoolAddress] = useState("");
  const { protectionPools } = useContext(ProtectionPoolContext);
  const {
    user,
    setUser,
    buyProtectionLoading,
    depositAmountLoading,
    requestAmountLoading
  } = useContext(UserContext);

  useEffect(() => {
    setProtectionPoolAddress(contractAddresses?.pool);
  }, [contractAddresses]);

  const ProtectionPurchaseSection = () => (
    <>
      <h3 className="text-left font-bold mt-8 md:mt-0">
        Your Protection Purchases
      </h3>
      <div className="flex md:hidden mt-4">
        {user.userLendingPools.map((userLendingPool) => (
          <ProtectionPurchasesCard
            key={userLendingPool.lendingPoolAddress}
            protectionPurchasesData={userLendingPool}
          />
        ))}
      </div>
      <div className="rounded-2xl shadow-card p-8 mt-4 mb-16 hidden md:flex">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th>
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Lending Pool</p>
                </div>
              </th>
              <th>
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Protection Amount</p>
                </div>
              </th>
              <th>
                <div className="flex items-center justify-start mr-4">
                  <p className="mr-4">Protection Expires In</p>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
              <th>
                <div className="flex items-center justify-start mr-4">
                  <p className="mr-4">Premium</p>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
              {/* <th>
                <div className="flex items-center justify-start mr-4">
                  <p className="mr-4">CARA Token Rewards</p>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th> */}
              <th>
                <div className="flex items-center justify-start mr-4">
                  <p className="mr-4">Renew</p>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
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
                  {numeral(
                    convertUSDCToNumber(userLendingPool.protectionAmount)
                  )
                    .format(USDC_FORMAT)
                    .toString()}
                  &nbsp;USDC
                </td>
                <td className="py-4">
                  {unixtimeDiffFromNow(
                    userLendingPool.expirationTimestamp.toNumber()
                  )}
                </td>
                <td className="py-4">7 %</td>
                <td className="py-4">~ 3.5 %</td>
                <td className="py-4">
                  <button
                    className="rounded-md bg-customBlue text-white px-6 py-2"
                    onClick={() => setIsRenewProtectionOpen(true)}
                  >
                    Renew
                  </button>
                </td>
              </tr>
            ))}
            {buyProtectionLoading && (
              <tr className="text-left text-ms font-medium">
                <td className="py-4 pr-4">
                  <Skeleton variant="text" width={210} height={30} />
                </td>
                <td className="py-4">
                  <Skeleton variant="circular" width={24} height={24} />
                </td>
                <td className="py-4">
                  <Skeleton variant="text" width={100} height={30} />
                </td>
                <td className="py-4">
                  <Skeleton variant="text" width={70} height={30} />
                </td>
                <td className="py-4">
                  <Skeleton variant="text" width={110} height={30} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const WithdrawalSection = () => (
    <>
      <h3 className="text-left font-bold mt-8 md:mt-0">
        Your Requested Withdrawal
      </h3>
      <div className="flex md:hidden mt-4">
        {user.userLendingPools.map((userLendingPool) => (
          <RequestedWithdrawalCard
            key={userLendingPool.lendingPoolAddress}
            requestedWithdrawalData={userLendingPool}
          />
        ))}
      </div>
      <div className="rounded-2xl shadow-card p-8 mt-4 mb-16 hidden md:flex">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th>Name</th>
              <th>
                <div className="flex flex-row pr-3 items-center">
                  <div className="mr-4">Withdrawable Window</div>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
              <th>
                <div className="flex flex-row pr-3 items-center">
                  <div className="mr-4">Request Withdrawal</div>
                </div>
              </th>
              <th>
                <div className="flex flex-row pr-3 items-center">Withdraw</div>
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
                <td className="pt-4">February 1st ~ 10th</td>
                <td className="pt-4">
                  {user.requestedWithdrawalAmount}&nbsp;USDC{" "}
                  {requestAmountLoading && (
                    <span className="text-gray-400 ml-2">
                      <CircularProgress color="inherit" size={16} />
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="rounded-md bg-customBlue text-white px-6 py-2"
                    onClick={() => setIsWithdrawOpen(true)}
                  >
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const DepositedSection = () => (
    <>
      <h3 className="text-left font-bold mb-4 -mt-16">
        Your Deposited Capital
      </h3>
      <div className="flex md:hidden">
        {protectionPools.map((protectionPool) => (
          <DepositedCapitalCard
            key={protectionPool.address}
            depositedCapitalData={protectionPool}
            userData={user}
            setIsWithdrawOpen={setIsWithdrawOpen}
          />
        ))}
      </div>
      <div className="rounded-2xl shadow-card p-8 mb-16 hidden md:flex">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th>Name</th>
              <th>
                <div className="flex flex-row pr-3 items-center">
                  <div className="mr-4">Estimated APY</div>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
              <th>
                <div className="flex flex-row pr-3 items-center">
                  <div className="mr-4">Deposited Amount</div>
                  <Tooltip
                    content="Time left until this protection expires"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
              <th>
                <div className="flex flex-row pr-3 items-center">
                  <div className="mr-4">Requested Withdrawal</div>
                  <Tooltip
                    content="The amount of capital you have requested to withdraw"
                    placement="top"
                  >
                    <Info size={16} className="text-customGrey" />
                  </Tooltip>
                </div>
              </th>
              <th></th>
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
                <td className="pt-4">{protectionPool.APY}</td>
                <td className="pt-4">
                  {user.sTokenUnderlyingAmount}&nbsp;USDC{" "}
                  {depositAmountLoading && (
                    <span className="text-gray-400 ml-2">
                      <CircularProgress color="inherit" size={16} />
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="rounded-md bg-customBlue text-white px-6 py-2"
                    onClick={() => setIsWithdrawalRequestOpen(true)}
                  >
                    Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <main className="container mx-auto px-4">
      <TitleAndDescriptions title="Portfolio" buttonExist={false} />
      <DepositedSection />
      <WithdrawalSection />
      <ProtectionPurchaseSection />
      <WithdrawalRequestPopUp
        open={isWithdrawalRequestOpen}
        onClose={() => setIsWithdrawalRequestOpen(false)}
        protectionPoolAddress={protectionPoolAddress}
      />
      <WithdrawPopUp
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        protectionPoolAddress={protectionPoolAddress}
        requestedWithdrawalAmount={user.requestedWithdrawalAmount}
      />
      <RenewProtectionPopUp
        open={isRenewProtectionOpen}
        onClose={() => setIsRenewProtectionOpen(false)}
      />
    </main>
  );
};

export default Portfolio;
