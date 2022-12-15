import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import { useContext } from "react";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { formatAddress } from "@utils/utils";

const BuyProtection = () => {
  const { lendingPools } = useContext(LendingPoolContext);
  const handleClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="mx-32">
      <TitleAndDescriptions
        title="Buy Protection"
        descriptions="Buy protection for your loans to hedge against default risks."
        buttonExist={true}
        button="Learn about buying protection"
      />
      <h3 className="text-left font-bold">All Lending Pools</h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-sm font-bold py-4">
              <th className="py-4">Address</th>
              <th className="py-4">Lending Pool</th>
              <th className="py-4">Protocol</th>
              <th className="py-4">
                <div className="flex flex-row justify-between mr-4">
                  Estimated Adjusted Yields
                  {/* <div className="float-right"> */}
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                    content="Lending Pool APY - Premium."
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
              <th className="py-4">
                <div className="flex flex-row justify-between mr-4">
                  Lending Pool APY
                  {/* <div className="float-right"> */}
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
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
              <th className="py-4">CARA Token Rewards</th>
              <th className="py-4">Premium</th>
              <th className="py-4">Time Left</th>
            </tr>
          </thead>
          <tbody>
            {lendingPools.map((lendingPool) => (
              <tr
                key={lendingPool.address}
                onClick={() => handleClick(`/lendingPool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`)}
                className="text-left text-sm font-medium hover:cursor-pointer"
              >
                <td className="py-4">
                  {formatAddress(lendingPool.address)}
                </td>
                <td className="py-4">
                  {lendingPool.name}
                </td>
                <td className="py-4">
                  <Image
                    src={lendingPool.protocol}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-4">
                  {lendingPool.adjustedYields}
                </td>
                <td className="py-4">
                  {lendingPool.lendingPoolAPY}
                </td>
                <td className="py-4">
                  {lendingPool.CARATokenRewards}
                </td>
                <td className="py-4">
                  {lendingPool.premium}
                </td>
                <td className="py-4">
                  {lendingPool.timeLeft}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyProtection;
