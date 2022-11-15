import { useRouter } from "next/router";
import { useState } from "react";

const ProtectionPool = () => {
  const router = useRouter();
  const protectionPoolId = router.query.id;
  const [tradeOpen, setTradeOpen] = useState(false);

  return (
    <div>
      <div>ProtectionPool #{protectionPoolId}</div>
      <button
        className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
        onClick={() => {
          setTradeOpen(true);
        }}
      >
        Preview
      </button>
    </div>
  );
};

export default ProtectionPool;
