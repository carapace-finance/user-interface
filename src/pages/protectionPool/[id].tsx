import { useRouter } from "next/router";

const ProtectionPool = () => {
  const router = useRouter();
  const protectionPoolId = router.query.id;

  return <div>ProtectionPool #{protectionPoolId}</div>;
};

export default ProtectionPool;
