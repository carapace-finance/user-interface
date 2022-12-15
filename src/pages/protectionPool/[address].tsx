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
import {Chart, ArcElement, Legend} from 'chart.js'
Chart.register(ArcElement);
Chart.register(Legend);
import { Doughnut } from 'react-chartjs-2';

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
      let totalCapitalNumber = totalCapital.replace(/\D/g,'');
      let depositLimitNumber = depositLimit.replace(/\D/g,'');
      depositPercentage=(totalCapitalNumber/depositLimitNumber)*100;
    }
  });
  const underlyingLendingPools = lendingPools.filter(
    (lendingPool) => lendingPool.protectionPoolAddress === protectionPoolAddress
  );
  const plugins = [{
    id:'title',
    beforeDraw: (chart: any) => {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 200).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "top";
        const text = totalCapital;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2.25;
        ctx.fillText(text, textX, textY);
        ctx.save();
    }
  }];
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
        <div className="rounded-2xl shadow-boxShadow py-6 px-5 h-full w-600">
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
                Protection Purchase Till Date
              </div>
            </div>
            <div className="h-[500px] w-full flex">
              <Doughnut 
              className="mx-auto"
              plugins = {plugins}
              options={{
                cutout:"70%",
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    onClick:()=>{}
                  },
                },
                elements:{
                  arc:{
                    borderAlign: "center",
                    borderWidth: 0
                  }
                }
              }}
              data={{
                labels: underlyingLendingPools.map((lendingPool) => {
                  const total = underlyingLendingPools.map(lendingPool =>Number(lendingPool.protectionPurchase.replace(/\D/g,''))).reduce((accumulator, currentValue) => accumulator + currentValue)
                  return `${lendingPool.name} ${Math.round(Number(lendingPool.protectionPurchase.replace(/\D/g,'')) / total* 100) }%`
                }),
                datasets:[
                  {
                    backgroundColor: ['hsl(0, 0%, 60%)', 'hsl(0, 0%, 35%)'],
                    data:underlyingLendingPools.map((lendingPool) => Number(lendingPool.protectionPurchase.replace(/\D/g,'')))
                  }
                ]
              }} />
            </div>
          </div>
        </div>
        <SellProtectionCard></SellProtectionCard>
      </div>
      <div className="mt-10">
        <h2 className="text-left flex items-center">Underlying Protected Lending Pools</h2>
        <div className="block py-10 px-6 bg-white rounded-2xl shadow-boxShadow w-full">
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th>Adress</th>
                <th>Lending Pool</th>
                <th>Protocol</th>
                <th>APY</th>
                <th>Payment Term</th>
                <th>Opening Date</th>
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
                  <td>{"TERM"}</td>
                  <td>{"DATE"}</td>
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
      </div>
    </div>
  );
};

export default ProtectionPool;
