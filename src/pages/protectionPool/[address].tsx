import { useRouter } from "next/router";
import SellProtectionCard from "@components/SellProtectionCard";

const ProtectionPool = () => {
  const router = useRouter();
  const protectionPoolAddress = router.query.address;

  return (
    <div>
      <div>ProtectionPool #{protectionPoolAddress}</div>
      <SellProtectionCard></SellProtectionCard>
    </div>
  );
};

export default ProtectionPool;
