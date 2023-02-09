import { Tooltip } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Image from "next/image";
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);
import { useContext } from "react";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { useRouter } from "next/router";

const BuyProtection = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <main className="container mx-auto px-4">
      <TitleAndDescriptions
        title="Protect"
        descriptions="Buy protection for your lending pools to hedge against default risks"
        buttonExist={true}
        button="Learn about buying protection"
        guideLink="https://www.carapace.finance/docs/protocol-mechanics/protection_buyers"
      />
    </main>
  );
};

export default BuyProtection;
