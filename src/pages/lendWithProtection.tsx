import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import { BondContext } from "@contexts/BondContextProvider";

const LendWithProtection = () => {
  const { bonds, setBonds } = useContext(BondContext);

  return (
    <div>
      <TitleAndDescriptions
        title="Lend with Protection"
        descriptions="Earn adjusted yields by purchasing bonds with protection"
        buttonExist={true}
        button="Learn about lending with protection"
      />
      <div>All Bonds with Protection</div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Pool Token Id</th>
            <th>Bond Price</th>
            <th>Lending Pool</th>
            <th>Protocol</th>
            <th>Adjusted Yields</th>
            <th>Lending Pool APY</th>= <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          {bonds.map((bond) => (
            <tr key={bond.poolTokenId}>
              <td>{bond.poolTokenId}</td>
              <td>{bond.price}</td>
              <td>{bond.lendingPool}</td>
              <td>
                <Image src={bond.protocol} width={24} height={24} alt="" />
              </td>
              <td>{bond.adjustedYields}</td>
              <td>{bond.lendingPoolAPY}</td>
              <td>{bond.premium}</td>
              <td>
                <Link key={bond.poolTokenId} href={"/bond/" + bond.poolTokenId}>
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

export default LendWithProtection;
