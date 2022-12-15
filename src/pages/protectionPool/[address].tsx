import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import BarChart from "@components/BarChart";
import SellProtectionCard from "@components/SellProtectionCard";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { formatAddress } from "@utils/utils";
import TitleAndDescriptions from "@components/TitleAndDescriptions";
import assets from "src/assets";

const ProtectionPool = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const { protectionPools } = useContext(ProtectionPoolContext);

  let protectionPoolAddress;
  let protocols;
  let totalCapital;
  let totalProtection;
  let depositLimit;
  let depositPercentage = 0;
  protectionPools.map((protectionPool) => {
    if (protectionPool.address === router.query.address) {
      protectionPoolAddress = protectionPool.address;
      protocols = protectionPool.protocols;
      totalCapital = protectionPool.totalCapital;
      totalProtection = protectionPool.totalProtection;
      depositLimit = protectionPool.depositLimit;
      totalProtection = protectionPool.totalProtection;
      let totalCapitalNumber = totalCapital.replace(/\D/g,'');
      let depositLimitNumber = depositLimit.replace(/\D/g,'');
      depositPercentage=(totalCapitalNumber/depositLimitNumber)*100;
    }
  });

  const underlyingLendingPools = lendingPools.filter(
    (lendingPool) => lendingPool.protectionPoolAddress === protectionPoolAddress
  );

  return (
   <div className="mx-32">
      <div className="flex">
        <TitleAndDescriptions
          title={`Protection Pool ${formatAddress(router.query.address)}`}
          descriptions=""
          buttonExist={false}
        />
        <div className="ml-3">
          <div className="flex items-center ">
            <Image src={protocols} width={40} height={40} alt="" className="mr-6" />
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${protectionPoolAddress}`}
              className=""
            >
              <img
                src={assets.footerLogo.src}
                alt="carapace"
                className="w-[40px]"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="rounded-2xl shadow-boxShadow py-6 px-5 h-64 w-600">
          <div className="">
            <div className="text-left text-2xl">
              <div className="text-black text-2xl font-bold mb-4">Current Capital in the Pool</div>
            </div>
            <div className="h-6 mb-2">
              <BarChart filledPercentage={depositPercentage}/>
            </div>
            <div className="flex justify-between">
              <div className="text-xs leading-4 pr-20">Deposited Amount: {totalCapital}</div>
              <div className="text-xs leading-4">Deposit Limit: {depositLimit}</div>
            </div>
          </div>
          <div className="下段">
            <div >
              <div className="text-left text-black text-2xl font-bold my-4 flex">
                Leverage Ratio
                <div className="pl-2 items-center">
                  <Tooltip 
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}                
                      content="the total capital in the pool divided by the total protection amount."
                      placement="top"
                    >
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
                </div>
              </div>
            </div>
            <div className="h-6 mb-2">
              {/* <BarChart filledPercentage={capitalProtectionPercentage}/> */}
            </div>
            <div className="flex justify-between">
            <h2>Protection Purchases Till Date</h2>
              {underlyingLendingPools.map((lendingPool) => {
                return (
                  <div key={lendingPool.address}>
                    {formatAddress(lendingPool.address)} :{" "}
                    {lendingPool.protectionPurchase}
                  </div>
                );
              })}
              <div>Total Protection: {totalProtection}</div>
            </div>
          </div>
        </div>
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
