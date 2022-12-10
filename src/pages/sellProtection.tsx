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

const SellProtection = () => {
  const { protectionPools } = useContext(ProtectionPoolContext);

  return (
    <div>
      <TitleAndDescriptions
        title="Sell Protection"
        descriptions="Earn yields by depositing capital to diversified protection pools you think are safe."
        buttonExist={true}
        button="Learn about selling protection"
      />
      <div>All Protection Pools</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Address</th>
            <th>Protocols</th>
            <th>APY</th>
            <th>Total Capital</th>
            <th>Total Protection</th>
          </tr>
        </thead>
        <tbody>
          {protectionPools.map((protectionPool) => (
            <tr key={protectionPool.address}>
              <td>{formatAddress(protectionPool.address)}</td>
              <td>
                <Image
                  src={protectionPool.protocols}
                  width={24}
                  height={24}
                  alt=""
                />
              </td>
              <td>{protectionPool.APY}</td>
              <td>{protectionPool.totalCapital}</td>
              <td>{protectionPool.totalProtection}</td>
              <td>
                <Link
                  key={protectionPool.address}
                  href={"/protectionPool/" + protectionPool.address}
                >
                  link
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
