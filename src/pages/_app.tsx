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
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@material-tailwind/react";
import getWeb3Library from "@/utils/mainnet/providers";
import "@/style/main.css";

import dynamic from "next/dynamic";
import { ApplicationContextProvider } from "@/contexts/ApplicationContextProvider";
import { BondContextProvider } from "@/contexts/BondContextProvider";
import { LendingPoolContextProvider } from "@/contexts/LendingPoolContextProvider";
import { ProtectionPoolContextProvider } from "@/contexts/ProtectionPoolContextProvider";
import { UserContextProvider } from "@/contexts/UserContextProvider";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

// Record a pageview when route changes
Router.events.on("routeChangeComplete", (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

// wagmi config for dev
const { chains: devChains, provider: devProvider } = configureChains(
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
// wagmi config for prod
const { chains, provider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string })]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: process.env.NODE_ENV === "development" ? devChains : chains
    }),
    new WalletConnectConnector({
      chains: process.env.NODE_ENV === "development" ? devChains : chains,
      options: {
        qrcode: true,
        rpc: {
          1: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
        }
      }
    }),
    new CoinbaseWalletConnector({
      chains: process.env.NODE_ENV === "development" ? devChains : chains,
      options: {
        appName: "carapace.finance"
      }
    })
  ],
  provider: process.env.NODE_ENV === "development" ? devProvider : provider
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
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        maxSnack={3}
        dense
        autoHideDuration={6000}
      >
        <CssBaseline />
        <Web3ReactProvider getLibrary={getWeb3Library}>
          <WagmiConfig client={wagmiClient}>
            {/* TODO: Relpce web3react to wagmi */}
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
          </WagmiConfig>
        </Web3ReactProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
