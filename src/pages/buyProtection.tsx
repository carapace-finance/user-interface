import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Link from "next/link";
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

  return (
    <div className="mx-32">
      <TitleAndDescriptions
        title="Buy Protection"
        descriptions="Buy protection for your loans to hedge against default risks."
        buttonExist={true}
        button="Learn about buying protection"
      />
      <div className=" mb-6 text-left text-black text-2xl font-bold">All Lending Pools</div>
      <table className="table-auto rounded-2xl shadow-boxShadow px-8 w-full text-center">
        <thead>
          <tr className="text-sm font-bold gap-4 px-4">
            <th className="pl-4 pt-9 pb-6">address</th>
            <th className="pl-4 pt-9 pb-6">Lending Pool</th>
            <th className="pl-4 pt-9 pb-6">Protocol</th>
            <th className="pl-4 pt-9 pb-6">
              Adjusted Yields
              <div className="float-right">
                <Tooltip content="test test" placement="top">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
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
            <th className="pl-4 pt-9 pb-6">
              Lending Pool APY
              <div className="float-right">
              <Tooltip content="test test" placement="top">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
            <th className="pl-4 pt-9 pb-6">CARA Token Rewards</th>
            <th className="pl-4 pt-9 pb-6">Premium</th>
            <th className="pl-4 pt-9 pb-6">Time Left</th>
          </tr>
        </thead>
        <tbody>
          {lendingPools.map((lendingPool) => (
            <tr key={lendingPool.address}>
              <td className="pl-4 pt-9 pb-6">{formatAddress(lendingPool.address)}</td>
              <td className="pl-4 pt-9 pb-6">{lendingPool.name}</td>
              <td className="pl-4 pt-9 pb-6">
                <Image
                  src={lendingPool.protocol}
                  width={24}
                  height={24}
                  alt=""
                />
              </td>
              <td className="pl-4 pt-9 pb-6">{lendingPool.adjustedYields}</td>
              <td className="pl-4 pt-9 pb-6">{lendingPool.lendingPoolAPY}</td>
              <td className="pl-4 pt-9 pb-6">{lendingPool.CARATokenRewards}</td>
              <td className="pl-4 pt-9 pb-6">{lendingPool.premium}</td>
              <td className="pl-4 pt-9 pb-6">{lendingPool.timeLeft}</td>
              <td>
                <Link
                  key={lendingPool.address}
                  href={`/lendingPool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`}
                >
                  Link
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyProtection;
