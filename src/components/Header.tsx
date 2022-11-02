import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { injected } from "../utils/connectors";
import assets from "../assets";

import Account from "@components/Account";

const Header = () => {
  const { active, activate, deactivate } = useWeb3React();
  const { chainId } = useWeb3React();
  const router = useRouter();
  const [error, setError] = useState("");

  const onConnect = async (wallet: string) => {
    setError("");
    switch (wallet) {
      case "metamask": {
        try {
          await connect();
          router.push("/");
        } catch (e) {
          console.log("Error", e);
        }
        break;
      }
    }
  };

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <div className="flex justify-between items-center">
      <Link href="/">
        <Image
          src={assets.headerLogo.src}
          alt=""
          height="32"
          width="136"
          unoptimized
        />
      </Link>
      <Link href="/buyProtection">
        <h3>Buy Protection</h3>
      </Link>
      <Link href="/lendWithProtection">
        <h3>Lend With Protection</h3>
      </Link>
      <Link href="/sellProtection">
        <h3>Sell Protection</h3>
      </Link>
      <Link href="/dashboard">
        <h3>Dashboard</h3>
      </Link>
      <button
        className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
        onClick={async () => await onConnect("metamask")}
      >
        <span>
          {active && chainId === 1
            ? "Ethereum"
            : active && chainId != 1
            ? "Not Ethereum"
            : !active || error
            ? "Connect Wallet"
            : "Connect Wallet"}
        </span>
      </button>
      {active ? (
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={() => disconnect()}
        >
          <span>{"Disconnect"}</span>
        </button>
      ) : (
        ""
      )}
      <Account />
    </div>
  );
};

export default Header;
