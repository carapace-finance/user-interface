import { useRouter } from "next/router";
import { useState } from "react";
import BuyProtectionPopUp from "@components/BuyProtectionPopUp";

const LendingPool = () => {
  const router = useRouter();
  const lendingPoolId = router.query.id;
  const [tradeOpen, setTradeOpen] = useState(false);

  return (
    <div>
      <div>LendingPool #{lendingPoolId}</div>
      <button
        className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
        onClick={() => {
          setTradeOpen(true);
        }}
      >
        Preview
      </button>
      <BuyProtectionPopUp
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
      />
    </div>
  );
};

export default LendingPool;
