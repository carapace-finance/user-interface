import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ExternalLink } from "lucide-react";
import useQueryProtectionPool from "@/hooks/useQueryProtectionPool";
import TitleAndDescriptions from "@/components/TitleAndDescriptions";
const ProtectionPoolPage = dynamic(
  () => import("@components/ProtectionPoolPage"),
  {
    ssr: false
  }
);

const ProtectionPool = () => {
  const router = useRouter();
  const protectionPoolAddress = router.query.address as string;
  const { data, fetching, error } = useQueryProtectionPool(
    protectionPoolAddress
  );

  return (
    <main className="container mx-auto px-4 md:mt-36">
      <div className="w-full">
        <div className="-mt-8 md:-mt-4 mb-2 md:mb-4 text-xs md:text-sm text-customGrey">
          <Link href="/">Earn</Link> &gt; Goldfinch Protection Pool #1
        </div>
        <div className="flex">
          <TitleAndDescriptions
            title={
              <h1 className="inline-flex items-center flex-wrap text-left font-bold leading-4 md:leading-12 text-lg md:text-4xl mb-0 md:mb-6">
                Goldfinch Protection Pool #1
                <Image
                  src={require("@/assets/goldfinch.png")}
                  width={40}
                  height={40}
                  alt=""
                  className="ml-6 w-[25px] md:w-[40px]"
                />
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://etherscan.io/address/${protectionPoolAddress}`}
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
      </div>
      <ProtectionPoolPage
        protectionPoolData={data}
        protectionPoolFetching={fetching}
      />
    </main>
  );
};

export default ProtectionPool;
