import { useRouter } from "next/router";

const LendingPool = () => {
  const router = useRouter();
  const lendingPoolId = router.query.id;

  return <div>LendingPool #{lendingPoolId}</div>;
};

export default LendingPool;
