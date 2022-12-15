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
  const { updateContractAddresses, updateProvider, protectionPoolService } =
    useContext(ApplicationContext);

  // useEffect is called when component is mounted and playground is undefined at that time.
  // SO playgroundRef is used to store mutable playground object in a ref
  // so that it can be accessed during cleanup in useEffect.
  const playgroundRef = useRef(playground);

  const updatePlayground = (updatedPlayground) => {
    setPlayground(updatedPlayground);
    playgroundRef.current = updatedPlayground;
  };

  // playground idle timeout is 10 minutes
  let idleTimeoutInMilliSeconds = 1000 * 60 * 10;
  let idleTimerId;

  const cleanup = async () => {
    console.log("Cleanup...");
    const playgroundId = playgroundRef.current?.forkId;
    if (playgroundId) {
      console.log("Stopping playground: ", playgroundId);
      await stopPlayground(playgroundId);
    }
  };
  
  // this is to ensure that playground is stopped when user closes the tab
  useEffect(() => {
    // Vercel serverless functions are "cold/inactive" before first use and after some time of inactivity.
    // and take a few seconds to start up: download dependencies, compile, execute etc.
    // Ping start/stop api to "warm" them up for real use later
    fetch(`/api/playground/start?ping=true`);
    fetch(`/api/playground/stop?ping=true`);

    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  // Setup inactivity timer
  useEffect(() => {
    if (protectionPoolService && playground?.forkId) {
      protectionPoolService.setLastActionTimestamp();
      
      const checkForInactivity = () => {
        const lastActionTimestamp = protectionPoolService.getLastActionTimestamp();
        console.log("Last action timestamp: ", lastActionTimestamp);
        const inactiveTimeInMilliSeconds = (Date.now() - lastActionTimestamp);
        console.log("Inactive time in seconds: ", inactiveTimeInMilliSeconds/1000);
        if (inactiveTimeInMilliSeconds > idleTimeoutInMilliSeconds) { 
          console.log("Stopping playground due to inactivity...");
          cleanup();
        }
      };

      // Check every minute for inactivity
      // TODO: need to figure out why lastActionTimestamp is not getting updated
      // idleTimerId = setInterval(checkForInactivity, 1000 * 60 * 1);
      // console.log("Started inactivity timer...");

      return () => {
        if (idleTimerId) {
          clearInterval(idleTimerId);
          console.log("Cleared inactivity timer...");
        }
      }
    }
  }, [playground?.forkId]);

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
        updatePlayground(playground);

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
        updatePlayground(undefined);
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
      {/* {active && chainId === 1
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
      )} */}
      {playgroundButtonTitle === "Start Playground" ? (
        <button
          // disabled={!account}
          className="border rounded-md border-black px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={playgroundButtonAction}>
            <Tooltip
              content="Test our app features in a sandbox!"
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
