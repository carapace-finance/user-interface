import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import SellProtectionCard from "@components/SellProtectionCard";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { formatAddress } from "@utils/utils";

const ProtectionPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);

  let protectionPoolAddress;
  let protocols;
  let totalCapital;
  let totalProtection;
  protectionPools.map((protectionPool) => {
    if (protectionPool.address === router.query.address) {
      protectionPoolAddress = protectionPool.address;
      protocols = protectionPool.protocols;
      totalCapital = protectionPool.totalCapital;
      totalProtection = protectionPool.totalProtection;
    }
  });

  const underlyingLendingPools = lendingPools.filter(
    (lendingPool) => lendingPool.protectionPoolAddress === protectionPoolAddress
  );

  return (
    <div>
      <div>
        Protection Pool
        {formatAddress(router.query.address)}
      </div>
      <Image src={protocols} width={24} height={24} alt="" />
      <a href={`https://etherscan.io/address/${protectionPoolAddress}`}>link</a>
      <div>
        <h2>Capital in the Pool</h2>
        <div>{totalCapital}</div>
        <h2>Protection Purchases</h2>
        <div>{totalProtection}</div>
      </div>
      <SellProtectionCard></SellProtectionCard>

      <h2>Underlying Protected Lending Pools</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>address</th>
            <th>Lending Pool</th>
            <th>Protocol</th>
            <th>Lending Pool APY</th>
          </tr>
        </thead>
        <tbody>
          {underlyingLendingPools.map((lendingPool) => (
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
              <td>{lendingPool.lendingPoolAPY}</td>
              <td>
                <Link
                  key={lendingPool.address}
                  href={`/lendingPool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`}
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

export default ProtectionPool;
