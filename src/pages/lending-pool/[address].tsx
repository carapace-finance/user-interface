import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import TitleAndDescriptions from "@/components/TitleAndDescriptions";
import { ExternalLink } from "lucide-react";
import useQueryLendingPool from "@/hooks/useQueryLendingPool";
const LendingPoolPage = dynamic(() => import("@components/LendingPoolPage"), {
  ssr: false
});

export default function LendingPool() {
  const router = useRouter();
  const lendingPoolAddress = router.query.address as string;
  const { data, fetching, error } = useQueryLendingPool(lendingPoolAddress);
  console.log("lendingPoolData::", data, error);

  return (
    <main className="container mx-auto px-4">
      <div className="w-full">
        <div className="-mt-8 md:-mt-4 mb-2 md:mb-4 text-xs md:text-sm text-customGrey">
          <Link href="/buy-protection">Protect</Link> &gt; Dummy Name
        </div>
        <TitleAndDescriptions
          title={
            <h1 className="inline items-center flex-wrap text-left font-bold leading-4 md:leading-12 text-lg md:text-4xl mb-0 md:mb-6">
              Dummy Name
              <Image
                src={require("@/assets/goldfinch.png")}
                width={40}
                height={40}
                alt="Goldfinch"
                className="md:ml-6 inline w-[25px] md:w-[40px]"
              />
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={`https://etherscan.io/address/${lendingPoolAddress}`}
                className="ml-3 text-customGrey"
              >
                <ExternalLink size={20} className="inline" />
              </a>
            </h1>
          }
          descriptions=""
          buttonExist={false}
        />
      </div>
      <LendingPoolPage lendingPoolData={data} lendingPoolFetching={fetching} />
    </main>
  );
}
