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
import ErrorPopup from "./ErrorPopup";
import { LoadingButton } from "@mui/lab";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { active, activate, deactivate, chainId, account } = useWeb3React();
  const router = useRouter();
  const [error, setError] = useState("");
  const [stoppingPlayground, setStoppingPlayground] = useState(false);
  const [playground, setPlayground] = useState<Playground>();
  const { updateProviderAndContractAddresses, protectionPoolService } =
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
  let idleTimeoutInMilliSeconds = 1000 * 60 * 30;
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
    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  const pingStartAndStopApi = () => {
    // Vercel serverless functions are "cold/inactive" before first use and after some time of inactivity.
    // and take a few seconds to start up: download dependencies, compile, execute etc.
    // Ping start/stop api to "warm" them up for real use later
    fetch(`/api/playground/start?ping=true`);
    fetch(`/api/playground/stop?ping=true`);
  };

  const checkForInactivityAndPingStartStopApis = () => {
    if (protectionPoolService && playground?.forkId) {
      const lastActionTimestamp =
        protectionPoolService.getLastActionTimestamp();
      console.log("Last action timestamp: ", lastActionTimestamp);
      const inactiveTimeInMilliSeconds = Date.now() - lastActionTimestamp;
      console.log(
        "Inactive time in seconds: ",
        inactiveTimeInMilliSeconds / 1000
      );
      if (inactiveTimeInMilliSeconds > idleTimeoutInMilliSeconds) {
        console.log("Stopping playground due to inactivity...");
        cleanup();
      }

      pingStartAndStopApi();
    }
  };

  // Setup inactivity timer
  useEffect(() => {
    if (protectionPoolService && playground?.forkId) {
      pingStartAndStopApi();
      protectionPoolService.setLastActionTimestamp();

      // Check every minute for inactivity
      idleTimerId = setInterval(
        checkForInactivityAndPingStartStopApis,
        1000 * 60 * 1
      );
      console.log("Started inactivity timer...");

      return () => {
        if (idleTimerId) {
          clearInterval(idleTimerId);
          console.log("Cleared inactivity timer...");
        }
      };
    }
  }, [protectionPoolService, playground?.forkId]);

  const onError = (message, e) => {
    if (e) {
      console.log(message, e);
    }

    setError(message);
    setIsOpen(false);
  };

  const startPlayground = async () => {
    const result = await fetch(`/api/playground/start?userAddress=${account}`);
    if (result.status === 200) {
      const data = await result.json();
      if (data.success) {
        const playground = data.playground;
        playground.provider = new JsonRpcProvider(playground.url);

        updateProviderAndContractAddresses(playground.provider, {
          isPlayground: true,
          poolFactory: playground.poolFactoryAddress,
          pool: playground.poolAddress,
          premiumCalculator: playground.premiumCalculatorAddress
        });
        updatePlayground(playground);

        console.log(`Successfully started a playground with fork: ${playground.forkId}`, playground);
      }
    } else {
      onError(
        "Failed to start playground. Please try again.",
        await result.json()
      );
    }
  };

  const stopPlayground = async (playgroundId) => {
    setStoppingPlayground(true);
    const result = await fetch(`/api/playground/stop?userAddress=${account}`, {
      method: "DELETE",
      body: playgroundId
    });
    console.log("Stop playground result", result);

    if (result.status === 200) {
      const data = await result.json();
      if (data.success) {
        updateProviderAndContractAddresses(undefined, {
          isPlayground: false,
          poolFactory: undefined,
          pool: undefined,
          premiumCalculator: undefined
        });
        updatePlayground(undefined);

        console.log("Successfully stopped playground: ", playgroundId);
        setStoppingPlayground(false);
      } else {
        onError("Failed to stop playground. Please try again.", data);
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
    <div className="sticky z-30 w-full bg-white flex justify-between items-center top-0 h-16 shadow-md mb-12">
      <Link className="ml-12" href="/">
        <Image
          src={assets.headerLogo.src}
          alt=""
          height="36"
          width="160"
          unoptimized
        />
      </Link>
      <div className="flex items-center">
        <Link
          href="/buyProtection"
          className={`${
            router.pathname == "/buyProtection" ||
            router.pathname.startsWith("/lendingPool") ||
            router.pathname == "/"
              ? "text-customBlue font-medium"
              : ""
          } hover:text-customBlue`}
        >
          <h3>Buy</h3>
        </Link>
        {/* <Link href="/lendWithProtection">
          <h3>Lend With Protection</h3>
        </Link> */}
        <Link
          href="/sellProtection"
          className={`${
            router.pathname == "/sellProtection" ||
            router.pathname.startsWith("/protectionPool")
              ? "text-customBlue font-medium"
              : ""
          } hover:text-customBlue ml-16`}
        >
          <h3>Sell</h3>
        </Link>
      </div>
      <div className="mr-12">
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
            className="text-white bg-customBlue rounded-md px-4 py-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
            onClick={playgroundButtonAction}
          >
            <Tooltip
              content="Test our app features in a sandbox!"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 }
              }}
              placement="bottom"
            >
              <span>{playgroundButtonTitle}</span>
            </Tooltip>
          </button>
        ) : (
          <button
            // disabled={!account}
            className="border rounded-md px-4 py-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline disabled:opacity-50"
            onClick={playgroundButtonAction}
          >
            <div>
              {stoppingPlayground ? (
                <>
                  Stopping playground...
                  <LoadingButton loading={true}></LoadingButton>
                </>
              ) : (
                playgroundButtonTitle
              )}
            </div>
          </button>
        )}
        {/* <Account /> */}
      </div>
      <PlaygroundModePopUp
        open={isOpen}
        playground={playground}
        onClose={() => setIsOpen(false)}
      ></PlaygroundModePopUp>
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </div>
  );
};

export default Header;
