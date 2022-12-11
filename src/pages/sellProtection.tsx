import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { useContext, useEffect } from "react";
import numeral from "numeral";
import {
  getPoolContract,
  getPoolFactoryContract
} from "@contracts/contractService";
import { convertUSDCToNumber, USDC_FORMAT } from "@utils/usdc";
import { formatAddress } from "@utils/utils";
import assets from "../assets";

const SellProtection = () => {
  const { contractAddresses, provider } = useContext(ApplicationContext);
  const { protectionPools, setProtectionPools } = useContext(
    ProtectionPoolContext
  );
  const goldfinchLogo = assets.goldfinch.src;

  useEffect(() => {
    if (contractAddresses?.poolFactory && provider) {
      console.log("Fetching pools...");
      const poolFactory = getPoolFactoryContract(
        contractAddresses.poolFactory,
        provider.getSigner()
      );
      poolFactory.getPoolAddress(1).then((poolAddress) => {
        console.log("Pool address", poolAddress);

        const pool = getPoolContract(poolAddress, provider.getSigner());
        pool.totalProtection().then((totalProtection) => {
          pool.totalSTokenUnderlying().then((totalCapital) => {
            setProtectionPools([
              {
                address: poolAddress,
                protocols: goldfinchLogo,
                APY: "8 - 15%",
                totalCapital:
                  numeral(convertUSDCToNumber(totalCapital)).format(
                    USDC_FORMAT
                  ) + " USDC",
                totalProtection:
                  numeral(convertUSDCToNumber(totalProtection)).format(
                    USDC_FORMAT
                  ) + " USDC"
              }
            ]);
          });
        });
      });
    }
  }, [contractAddresses?.poolFactory, provider]);

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
            <th>
              Estimated APY
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
            </th>
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
