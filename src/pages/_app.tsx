import React, { useEffect } from "react";
import Router from "next/router";
import * as Fathom from "fathom-client";
import { Web3ReactProvider } from "@web3-react/core";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@material-tailwind/react";
import getWeb3Library from "../utils/mainnet/providers";
import "@style/main.css";

import dynamic from "next/dynamic";
import { ApplicationContextProvider } from "@contexts/ApplicationContextProvider";
import { BondContextProvider } from "@contexts/BondContextProvider";
import { LendingPoolContextProvider } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContextProvider } from "@contexts/ProtectionPoolContextProvider";
import { UserContextProvider } from "@contexts/UserContextProvider";

const Header = dynamic(() => import("@components/Header"), { ssr: false });
const Footer = dynamic(() => import("@components/Footer"), { ssr: false });

// Record a pageview when route changes
Router.events.on("routeChangeComplete", (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

// wagmi config
// TODO: remove localhost config for production
const { chains, provider } = configureChains(
  [mainnet, localhost],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: localhost.rpcUrls.default[0]
      })
    })
  ]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        rpc: {
          1: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
        }
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "carapace.finance"
      }
    })
  ],
  provider
});

function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      url: "https://amazing-protected.carapace.finance/script.js"
    });
  }, []);

  return (
    <ThemeProvider>
      <CssBaseline />
      <WagmiConfig client={wagmiClient}>
        {/* TODO: Relpce web3react to wagmi */}
        <Web3ReactProvider getLibrary={getWeb3Library}>
          <ApplicationContextProvider>
            <ProtectionPoolContextProvider>
              <LendingPoolContextProvider>
                <BondContextProvider>
                  <UserContextProvider>
                    <Header />
                    <Component {...pageProps} />
                    <Footer />
                  </UserContextProvider>
                </BondContextProvider>
              </LendingPoolContextProvider>
            </ProtectionPoolContextProvider>
          </ApplicationContextProvider>
        </Web3ReactProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
