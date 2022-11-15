import { useRouter } from "next/router";
import BuyProtectionCard from "@components/BuyProtectionCard";

const LendingPool = () => {
  const router = useRouter();
  const lendingPoolId = router.query.id;

  return (
    <div>
      <div>LendingPool #{lendingPoolId}</div>
      <BuyProtectionCard></BuyProtectionCard>
    </div>
  );
};

export default LendingPool;
