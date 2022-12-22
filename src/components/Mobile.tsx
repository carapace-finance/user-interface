import { Link } from "@mui/material";
import React from "react";

const Mobile = () => {
  return (
    <div className="grid h-screen place-items-center m-16">
      <p>
        Whoooops! Sorry, we don&apos;t have the mobile version yet. Visit our dapp
        from your desktop!
      </p>
      <p>
        You can visit our website
        <Link href="https://www.carapace.finance/"> here</Link>
      </p>
    </div>
  );
};

export default Mobile;
