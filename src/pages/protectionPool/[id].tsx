import { useRouter } from "next/router";
import SellProtectionCard from "@components/SellProtectionCard";

const ProtectionPool = () => {
  const router = useRouter();
  const protectionPoolId = router.query.id;

  return (
    <div>
      <div>ProtectionPool #{protectionPoolId}</div>
      <SellProtectionCard></SellProtectionCard>
    </div>
  );
};

export default ProtectionPool;
