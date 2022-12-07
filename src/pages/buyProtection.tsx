import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import { useContext, useEffect } from "react";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import {
  getPoolContract,
  getPoolFactoryContract,
  getReferenceLendingPoolsContract
} from "@contracts/contractService";
import { formatAddress } from "@utils/utils";
import assets from "../assets";

const BuyProtection = () => {
  const { contractAddresses, provider } = useContext(ApplicationContext);
  const { lendingPools, setLendingPools } = useContext(LendingPoolContext);

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
        pool.getPoolInfo().then((poolInfo) => {
          console.log("Pool info", poolInfo);
          const referenceLendingPoolsContract =
            getReferenceLendingPoolsContract(
              poolInfo.referenceLendingPools,
              provider.getSigner()
            );
          referenceLendingPoolsContract
            .getLendingPools()
            .then((lendingPools) => {
              console.log("Lending pools", lendingPools);
              setLendingPools(
                lendingPools.map((lendingPool) => {
                  return {
                    address: lendingPool,
                    name: "Lend East #1: Emerging Asia Fintech Pool",
                    protocol: goldfinchLogo,
                    adjustedYields: "7 - 10%",
                    lendingPoolAPY: "17%",
                    CARATokenRewards: "~3.5%",
                    premium: "4 - 7%",
                    timeLeft: "59 Days 8 Hours 2 Mins",
                    protectionPoolAddress: poolAddress
                  };
                })
              );
            });
        });
      });
    }
  }, [contractAddresses?.poolFactory]);

  return (
    <div>
      <TitleAndDescriptions
        title="Buy Protection"
        descriptions="Buy protection for your loans to hedge against default risks."
        buttonExist={true}
        button="Learn about buying protection"
      />
      <div>All Lending Pools</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>address</th>
            <th>Lending Pool</th>
            <th>Protocol</th>
            <th>Adjusted Yields</th>
            <th>Lending Pool APY</th>
            <th>CARA Token Rewards</th>
            <th>Premium</th>
            <th>Time Left</th>
          </tr>
        </thead>
        <tbody>
          {lendingPools.map((lendingPool) => (
            <tr key={lendingPool.address}>
              <td>{formatAddress(lendingPool.address)}</td>
              <td>{lendingPool.name}</td>
              <td>
                <Image
                  src={lendingPool.protocol}
                  width={24}
                  height={24}
                  alt=""
                />
              </td>
              <td>{lendingPool.adjustedYields}</td>
              <td>{lendingPool.lendingPoolAPY}</td>
              <td>{lendingPool.CARATokenRewards}</td>
              <td>{lendingPool.premium}</td>
              <td>{lendingPool.timeLeft}</td>
              <td>
                <Link
                  key={lendingPool.address}
                  href={`/lendingPool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`}
                >
                  Buy Protection
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
