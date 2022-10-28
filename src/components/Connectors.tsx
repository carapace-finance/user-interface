import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Spinner from "./Spinner";
import { useEagerConnect } from "../hooks/useEagerConnect";
import { useInactiveListener } from "../hooks/useInactiveListener";
import { connectorsByName, getErrorMessage } from "../utils/connectors";

export default function Connectors() {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, error, activate, deactivate } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <>
      <hr />
      <div>
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName[name];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled =
            !triedEager || !!activatingConnector || connected || !!error;

          return (
            <button
              disabled={disabled}
              className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(connectorsByName[name]);
              }}
            >
              <div>
                {activating && <Spinner color={"black"} />}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          );
        })}
      </div>
      <div>
        {(active || error) && (
          <button
            onClick={() => {
              deactivate();
            }}
            className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          >
            Disconnect
          </button>
        )}

        {!!error && <h4>{getErrorMessage(error)}</h4>}
        {chainId === 1337 || chainId === 31337 ? (
          <h4>you are connected to the local network</h4>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}
