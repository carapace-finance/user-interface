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
      <TitleAndDescriptions
        title="Sell Protection"
        descriptions="Earn yields by depositing capital to diversified protection pools you think are safe."
        buttonExist={true}
        button="Learn about selling protection"
      />
      <div className=" mb-6 text-left text-black text-2xl font-bold">All Protection Pools</div>
      <table className="table-auto rounded-2xl shadow-boxShadow px-8 w-full text-left">
        <thead>
          <tr className="text-sm font-bold gap-4">
            <th className="pl-10 pt-9 pb-6">Address</th>
            <th className="pl-4 pt-9 pb-6 ">Protocols</th>
            <th className="pl-4 pt-9 pb-6">
              Estimated APY
              <div className="float-right">
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
                    stroke="currentColor"
                    className="w-6 h-6 text-customGrey"
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
            <th className="pl-4 pt-9 pb-6">Total Capital</th>
            <th className="pl-4 pt-9 pb-6">Total Protection</th>
          </tr>
        </thead>
        <tbody>
          {protectionPools.map((protectionPool) => (
            <tr key={protectionPool.address}>
              <td className="pl-10 pt-6 pb-6">{formatAddress(protectionPool.address)}</td>
              <td className="pl-4 pt-6 pb-6">
                <Image
                  src={protectionPool.protocols}
                  width={24}
                  height={24}
                  alt=""
                />
              </td>
              <td className="pl-4 pt-6 pb-6">{protectionPool.APY}</td>
              <td className="pl-4 pt-6 pb-6">{protectionPool.totalCapital}</td>
              <td className="pl-4 pt-6 pb-6">{protectionPool.totalProtection}</td>
              <td className="pl-4 pt-6 pb-6 pr-10">
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
  );
};

export default SellProtection;
