import { UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 5] // 1 is Mainnet and 5 is Goerli.
});

export enum ConnectorNames {
  Injected = "MetaMask" // could this be other than MetaMask? Dapper maybe?
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected
};

export function getErrorMessage(_error: Error) {
  if (_error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (_error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (_error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(_error);
    return "An unknown error occurred. Check the console for more details.";
  }
}
