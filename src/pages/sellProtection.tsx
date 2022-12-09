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
                totalCapital: numeral(convertUSDCToNumber(totalCapital)).format(USDC_FORMAT) + " USDC",
                totalProtection: numeral(convertUSDCToNumber(totalProtection)).format(USDC_FORMAT) + " USDC"
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
