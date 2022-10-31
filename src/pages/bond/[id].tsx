import { useRouter } from "next/router";
import { useState } from "react";
import LendWithProtectionPopUp from "@components/LendWithProtectionPopUp";

const Bond = () => {
  const router = useRouter();
  const bondId = router.query.id;
  const [tradeOpen, setTradeOpen] = useState(false);

  return (
    <div>
      <div>Bond #{bondId}</div>
      <button
        className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
        onClick={() => {
          setTradeOpen(true);
        }}
      >
        Preview
      </button>
      <LendWithProtectionPopUp
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
      />
    </div>
  );
};

export default Bond;
