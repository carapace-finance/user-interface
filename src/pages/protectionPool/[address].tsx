import { useRouter } from "next/router";
import SellProtectionCard from "@components/SellProtectionCard";
import { formatAddress } from "@utils/utils";

const ProtectionPool = () => {
  const router = useRouter();

  return (
    <div>
      <div>ProtectionPool #{formatAddress(router.query.address)}</div>
      <SellProtectionCard></SellProtectionCard>
    </div>
  );
};

export default ProtectionPool;
