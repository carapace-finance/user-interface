import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useContext } from "react";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { useRouter } from "next/router";

const AllLendingPools = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <table className="table-fixed w-full">
      <thead>
        <tr className="text-left text-sm font-bold">
          <th className="py-8 pl-8">
            <div className="flex flex-row justify-start mr-4">
              <p className="mr-4">Name</p>
              <Tooltip
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
                content="The name of the underlying lending pool for which you can buy protection"
                placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#6E7191"
                  className="w-4 h-4"
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
          <th className="py-8">Protocol</th>
          <th className="py-8">
            <div className="flex flex-row justify-start mr-4">
              <p className="mr-4">Estimated Premium</p>
              <Tooltip
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
                content="Estimated premium amount divided your lending amount"
                placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#6E7191"
                  className="w-4 h-4"
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
              <p className="mr-4">Lending Pool APY</p>
              <Tooltip
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
                content="APY in an underlying lending protocol"
                placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#6E7191"
                  className="w-4 h-4"
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
              <Tooltip
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
                content="Lending Pool APY minus Premium"
                placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#6E7191"
                  className="w-4 h-4"
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
              <p className="mr-4">Buy Protection Within</p>
              <Tooltip
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 }
                }}
                content="Time left to buy protection for this lending pool"
                placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#6E7191"
                  className="w-4 h-4"
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
        {lendingPools.map((lendingPool) => (
          <tr
            key={lendingPool.address}
            onClick={() =>
              handleClick(
                `/lending-pool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`
              )
            }
            className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
          >
            <td className="py-8 pl-8">{lendingPool.name}</td>
            <td className="py-8">
              <Image src={lendingPool.protocol} width={24} height={24} alt="" />
            </td>
            <td className="py-8">{lendingPool.premium}</td>
            <td className="py-8">{lendingPool.lendingPoolAPY}</td>
            <td className="py-8">{lendingPool.adjustedYields}</td>
            <td className="py-6">{lendingPool.timeLeft}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllLendingPools;
