import { Tooltip } from "@material-tailwind/react";
import { useWeb3React } from "@web3-react/core";
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { injected } from "../utils/mainnet/connectors";
import assets from "../assets";

import Account from "@components/Account";
import PlaygroundModePopUp from "@components/PlaygroundModePopUp";
import { Playground } from "@utils/forked/types";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { JsonRpcProvider } from "@ethersproject/providers";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { active, activate, deactivate, chainId, account } = useWeb3React();
  const router = useRouter();
  const [error, setError] = useState("");
  const [playground, setPlayground] = useState<Playground>();
  const { updateContractAddresses, updateProvider } =
    useContext(ApplicationContext);

  // inactivity timer
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     stopPlayground(playground?.forkId);
  //   }, 1000 * 60 * 10);
  //   return () => clearInterval(intervalId);
  // }, []);

  // this is to ensure that playground is stopped when user closes the tab
  const playgroundRef = useRef(playground);
  useEffect(() => {
    const cleanup = (e) => {
      console.log("Cleanup...");
      if (playgroundRef.current?.forkId) {
        console.log("Stopping playground: ", playground?.forkId);
        stopPlayground(playgroundRef.current.forkId);
      }
    };

    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);
  
  const startPlayground = async () => {
    const result = await fetch(`/api/playground/start?userAddress=${account}`);
    if (result.status === 200) {
      const data = await result.json();
      if (data.success) {
        const playground = data.playground;
        playground.provider = new JsonRpcProvider(playground.url);
        
        updateContractAddresses({
          isPlayground: true,
          poolFactory: playground.poolFactoryAddress,
          pool: playground.poolAddress
        });
        updateProvider(playground.provider);
        setPlayground(playground);
        playgroundRef.current = playground;

        console.log("Successfully started a playground: ", playground);
      }
    }
    else { 
      console.log("Failed to start playground: ", await result.json());
      setError("Failed to start playground. Please try again.");
    }
  };

  const stopPlayground = async (playgroundId) => { 
    const result = await fetch(`/api/playground/stop?userAddress=${account}`, { method: "DELETE", body: playgroundId });
    console.log("End playground result", result);
    if (result.status === 200) {
      const data = await result.json();
      if (data.success) {
        setPlayground(undefined);
        console.log("Successfully ended playground");
      }
      else {
        console.log("Failed to end playground: ", data);
        setError("Failed to end playground. Please try again.");
      }
    }
  };

  const onConnect = async (wallet: string) => {
    setError("");
    switch (wallet) {
      case "metamask": {
        try {
          await connect();
          router.push("/");
        } catch (e) {
          setError("Failed to connect to Metamask. Please try again.");
          console.log("Error", e);
        }
        break;
      }
    }
  };

  async function connect() {
    try {
      await activate(injected);
      // TODO: should update contract addresses & provider here for mainnet
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

  let playgroundButtonTitle;
  let playgroundButtonAction;
  if (playground?.forkId) {
    playgroundButtonTitle = "Stop Playground";
    playgroundButtonAction = async () => {
      await stopPlayground(playground.forkId);
    };
  } else {
    playgroundButtonTitle = "Start Playground";
    playgroundButtonAction = async () => {
      setIsOpen(true);
      await startPlayground();
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
      <Link href="/buyProtection" className="hover:text-customBlue">
        <h3>Buy Protection</h3>
      </Link>
      {/* <Link href="/lendWithProtection">
        <h3>Lend With Protection</h3>
      </Link> */}
      <Link href="/sellProtection" className="ml-14 hover:text-customBlue">
        <h3>Sell Protection</h3>
      </Link>
      <Link href="/dashboard"className="ml-14 hover:text-customBlue">
        <h3>Dashboard</h3>
      </Link>
      </div>
      <div className="mr-8">
      {active && chainId === 1
      ? null 
      : active && chainId != 1
      ? null
      : !active || error
      ? (
        <button
        className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
        onClick={async () => await onConnect("metamask")}
        >
          <span>Connect Wallet</span>
        </button>)
      : ("")}
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
        <button
          // disabled={!account}
          className="border rounded-md border-black px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={playgroundButtonAction}>
            <Tooltip
              content="Connect you wallet, and test app features in a sandbox."
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
              placement="bottom">
                <span>{playgroundButtonTitle}</span>
            </Tooltip>
        </button>
      ) : (
            <button
              // disabled={!account}
              className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
              onClick={playgroundButtonAction}>
              <span>{playgroundButtonTitle}</span>
            </button>
      )}
      {/* <Account /> */}
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
