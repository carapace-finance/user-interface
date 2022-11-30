import { useRouter } from "next/router";
import BuyProtectionCard from "@components/BuyProtectionCard";
import { formatAddress } from "@utils/utils";

const LendingPool = () => {
  const router = useRouter();

  return (
    <div>
      <div>LendingPool: {formatAddress(router.query.address)}</div>
      <BuyProtectionCard></BuyProtectionCard>
    </div>
  );
};

export default LendingPool;
