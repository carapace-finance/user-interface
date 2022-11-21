import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import assets from "../assets";
import { ContractAddressesContext } from "@contexts/ContractAddressesProvider";
import { useContext, useEffect, useState } from "react";
import { getPoolContract, getPoolFactoryContract } from "@contracts/contractService";
import { formatUSDC } from "@utils/usdc";

const goldfinchLogo = assets.goldfinch.src;

interface ProtectionPool {
  id: number;
  address: string;
  APY: string;
  protocols: string;
  totalCapital: string;
  totalProtection: string;
}
const defaultProtectionPools: ProtectionPool[] = [
  {
    id: 1,
    protocols: goldfinchLogo,
    APY: "15 - 20%",
    totalCapital: "$1M",
    totalProtection: "$2M"
  },
  {
    id: 2,
    protocols: goldfinchLogo,
    APY: "15 - 20%",
    totalCapital: "$1M",
    totalProtection: "$2M"
  },
  {
    id: 3,
    protocols: goldfinchLogo,
    APY: "15 - 20%",
    totalCapital: "$1M",
    totalProtection: "$2M"
  },
  {
    id: 4,
    protocols: goldfinchLogo,
    APY: "15 - 20%",
    totalCapital: "$1M",
    totalProtection: "$2M"
  }
];

const SellProtection = () => {
  const { contractAddresses, provider } = useContext(ContractAddressesContext);
  const [protectionPools, setProtectionPools ] = useState<ProtectionPool[]>(defaultProtectionPools);
  
  useEffect(() => {
    if (contractAddresses?.poolFactory && provider) {
      
      console.log("Fetching pools...");
      const poolFactory = getPoolFactoryContract(contractAddresses.poolFactory, provider.getSigner());
      poolFactory.getPoolAddress(1).then((poolAddress) => {
        console.log("Pool address", poolAddress);

        const pool = getPoolContract(poolAddress, provider.getSigner());
        pool.totalProtection().then((totalProtection) => { 
          pool.totalSTokenUnderlying().then((totalCapital) => { 
            setProtectionPools([
            {
              id: 1,
              address: poolAddress,
              protocols: goldfinchLogo,
              APY: "8 - 15%",
              totalCapital: formatUSDC(totalCapital),
              totalProtection: formatUSDC(totalProtection)
            }
          ]);
          });
        });
      });
    }
  },[contractAddresses?.poolFactory, provider]);
  
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
            <th>id</th>
            <th>Protocols</th>
            <th>APY</th>
            <th>Total Capital</th>
            <th>Total Protection</th>
          </tr>
        </thead>
        <tbody>
          {protectionPools.map((protectionPool) => (
            <tr key={protectionPool.id}>
              <td>{protectionPool.id}</td>
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
                  key={protectionPool.id}
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
