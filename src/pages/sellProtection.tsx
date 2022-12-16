import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { useContext } from "react";
import { formatAddress } from "@utils/utils";
import assets from "src/assets";

const SellProtection = () => {
  const { protectionPools } = useContext(ProtectionPoolContext);

  return (
    <div className="mx-32">
      <div className="h-5"></div>
      <TitleAndDescriptions
        title="Sell Protection"
        descriptions="Earn yields by depositing capital to diversified protection pools you think are safe"
        buttonExist={true}
        button="Learn about selling protection"
      />
      <h3 className="text-left font-bold">All Protection Pools</h3>
      <div className="h-5"></div>
      <div className="rounded-2xl shadow-table p-8">
        <table className="table-fixed w-full">
          <thead>
            <tr className="text-left text-sm font-bold py-4">
              <th className="py-4">Address</th>
              <th className="py-4">Protocols</th>
              <th className="py-4">
                <div className="flex flex-row justify-between mr-4">
                  Estimated APY
                  <Tooltip
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
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
            </tr>
          </thead>
          <tbody>
            {protectionPools.map((protectionPool) => (
              <tr key={protectionPool.address} className="text-left text-sm font-medium">
                <td className="py-4">{formatAddress(protectionPool.address)}</td>
                <td className="py-4">
                  <Image
                    src={protectionPool.protocols}
                    width={24}
                    height={24}
                    alt=""
                  />
                </td>
                <td className="py-4">{protectionPool.APY}</td>
                <td className="py-4">{protectionPool.totalCapital}</td>
                <td className="py-4">{protectionPool.totalProtection}</td>
                <td className="py-4">
                <Link
                  key={protectionPool.address}
                  href={"/protectionPool/" + protectionPool.address}
                >
                  <Image
                    src={assets.grayVector.src}
                    width={16}
                    height={24}
                    alt=""
                  />
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellProtection;
