import Image from "next/image";
import ImgEthereum from "@/assets/chains/ethereum.svg";
import ImgPolygon from "@/assets/chains/polygon.svg";
import ImgHardHat from "@/assets/chains/hard-hat.svg";
import { AlertTriangle } from "lucide-react";

type Props = {
  chainId: number;
  size?: number;
  klass?: string;
};

const ChainList = [
  { chainId: 1, img: ImgEthereum, name: "Ethereum" },
  { chainId: 137, img: ImgPolygon, name: "Polygon" },
  {
    chainId: 31_337,
    img: ImgHardHat,
    name: "Hardhat"
  }
];

export const getChainName = (chainId: number): string =>
  ChainList.find((chain: any) => chain.chainId === chainId)?.name ?? "";

const ChainIcon = ({ chainId, size }: { chainId: number; size: number }) => {
  const chain = ChainList.find((chain: any) => chain.chainId === chainId);

  return chain ? (
    <Image src={chain.img} alt={chain.name} width={size} height={size} />
  ) : (
    <AlertTriangle size={14} className="text-customGrey" />
  );
};

export default function ChainLogo({
  chainId,
  size = 18,
  klass = ""
}: Props): JSX.Element {
  return (
    <div className={`flex items-center shrink-0 ${klass}`}>
      <ChainIcon chainId={chainId} size={size} />
    </div>
  );
}
