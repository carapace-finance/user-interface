import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import moment from "moment";
import numeral from "numeral";
import { useContext } from "react";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { useRouter } from "next/router";

import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import { getLendingPoolName } from "@utils/forked/playground";

import assets from "src/assets";

const BuyProtection = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { user, setUser } = useContext(UserContext);
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="mx-32">
      <TitleAndDescriptions
        title="Protect"
        descriptions="Buy protection for your lending pools to hedge against default risks"
        buttonExist={true}
        button="Learn about buying protection"
        guideLink="https://docs.google.com/document/d/1kL2j-yLL8Syprj-kqVgF0yePRErlgjZdRRu2dPeCW3Q"
      />

      <h3 className="text-left font-bold">
        Your Lending Pools with Protection
      </h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-ms font-bold">
              <th className="py-4">Lending Pool</th>
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
            {user.userLendingPools.map((userLendingPool) => (
              <tr
                key={userLendingPool.lendingPoolAddress}
                className="text-left text-ms font-medium"
              >
                <td className="py-4">
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
                    convertUSDCToNumber(userLendingPool.protectionPremium)
                  )
                    .format(USDC_FORMAT)
                    .toString()}
                </td>
                <td className="py-4">17%</td>
                <td className="py-4">7 - 10%</td>
                <td className="py-4">
                  {moment
                    .duration(
                      userLendingPool.timeUntilExpirationInSeconds.toNumber() -
                        moment().unix(),
                      "seconds"
                    )
                    .humanize()}
                </td>
                <td className="py-4">
                  {numeral(
                    convertUSDCToNumber(userLendingPool.protectionAmount)
                  )
                    .format(USDC_FORMAT)
                    .toString()}
                </td>
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

      <h3 className="text-left font-bold mt-16">All Lending Pools</h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table">
        <div className="h-4"></div>
        <table className="table-fixed w-full ">
          <thead>
            <tr className="text-left text-sm font-bold">
              <th className="py-8 pl-8">Lending Pool</th>
              <th className="py-8">Protocol</th>
              <th className="py-8">Premium</th>
              <th className="py-8">
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Lending Pool APY</p>
                  {/* <div className="float-right"> */}
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 }
                    }}
                    content="APY in an underlying lending protocol like Goldfinch."
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
              <th className="py-8">
                <div className="flex flex-row justify-start mr-4">
                  <p className="mr-4">Estimated Adjusted Yields</p>
                  {/* <div className="float-right"> */}
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
              {/* <th className="py-8">CARA Token Rewards</th> */}
              <th className="py-8">Buy Protection Within</th>
            </tr>
          </thead>
          <tbody>
            {lendingPools.map((lendingPool) => (
              <tr
                key={lendingPool.address}
                onClick={() =>
                  handleClick(
                    `/lendingPool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`
                  )
                }
                className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
              >
                <td className="py-8 pl-8">{lendingPool.name}</td>
                <td className="py-8">
                  <Image
                    src={lendingPool.protocol}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-8">{lendingPool.premium}</td>
                <td className="py-8">{lendingPool.lendingPoolAPY}</td>
                <td className="py-8">{lendingPool.adjustedYields}</td>
                {/* <td className="py-8">
                  {lendingPool.CARATokenRewards}
                </td> */}
                <td className="py-6">{lendingPool.timeLeft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyProtection;
