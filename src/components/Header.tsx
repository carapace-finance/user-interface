import { Tooltip } from "@material-tailwind/react";
import { useWeb3React } from "@web3-react/core";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { injected } from "../utils/mainnet/connectors";
import assets from "../assets";

import Account from "@components/Account";
import PlaygroundModePopUp from "@components/PlaygroundModePopUp";
import { deployToFork } from "@utils/forked/tenderly";
import { preparePlayground, deletePlayground } from "@utils/forked/playground";
import { Playground } from "@utils/forked/types";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";

const Header = ({ tenderlyAccessKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { active, activate, deactivate } = useWeb3React();
  const router = useRouter();
  const [error, setError] = useState("");
  const [playground, setPlayground] = useState<Playground>();
  const { updateContractAddresses, updateProvider } =
    useContext(ApplicationContext);

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
      // TODO: should update contract addresses & provider here for mainnet similar to "initializePlayground"
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

  async function initializePlayground(playground) {
    await preparePlayground(playground);
    updateContractAddresses({
      isPlayground: true,
      poolFactory: playground.deployedContracts.poolFactoryInstance.address,
      pool: playground.deployedContracts.poolInstance.address
    });
    updateProvider(playground.provider);
    setPlayground(playground);
  }

  let playgroundButtonTitle;
  let playgroundButtonAction;
  if (playground?.forkId) {
    playgroundButtonTitle = "Stop Playground";
    playgroundButtonAction = async () => {
      await deletePlayground(playground.forkId, tenderlyAccessKey);
      setPlayground(undefined);
    };
  } else {
    playgroundButtonTitle = "Start Playground";
    playgroundButtonAction = async () => {
      setIsOpen(true);
      const playground = await deployToFork(tenderlyAccessKey);
      await initializePlayground(playground);
    };
  }

  return (
    <div className="flex justify-between items-center top-0 h-16 border-b border-headerBorder mb-10">
      <div className="-my-3 ml-8">
        <Link href="/">
          <Image
            src={assets.headerLogo.src}
            alt=""
            height="36"
            width="128"
            unoptimized
          />
        </Link>
      </div>
      <div className="flex items-center">
      <Link href="/buyProtection" className="hover:text-headerPageHover">
        <h3>Buy Protection</h3>
      </Link>
      {/* <Link href="/lendWithProtection">
        <h3>Lend With Protection</h3>
      </Link> */}
      <Link href="/sellProtection" className="ml-14 hover:text-headerPageHover">
        <h3>Sell Protection</h3>
      </Link>
      <Link href="/dashboard"className="ml-14 hover:text-headerPageHover">
        <h3>Dashboard</h3>
      </Link>
      </div>
      <div className="mr-8">
        {/* <button
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
      </button> */}
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
      {playgroundButtonTitle === "Start Playground" ? (
        <Tooltip
          content="Test app features in a sandbox, with a starting balance of 1 ETH."
          placement="right"
        >
          <button
            className="border rounded-md border-black px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
            onClick={playgroundButtonAction}
          >
            <span>{playgroundButtonTitle}</span>
          </button>
        </Tooltip>
      ) : (
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={playgroundButtonAction}
        >
          <span>{playgroundButtonTitle}</span>
        </button>
      )}
      <Account />
      <PlaygroundModePopUp
        open={isOpen}
        playground={playground}
        onClose={() => setIsOpen(false)}
      ></PlaygroundModePopUp>
      </div>
    </div>
  );
};

export default Header;
