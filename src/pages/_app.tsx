import "@/utils/wdyr";
import React, { useEffect } from "react";
import Router from "next/router";
import * as Fathom from "fathom-client";
import { Web3ReactProvider } from "@web3-react/core";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@material-tailwind/react";
import WagmiWrapper from "@/components/WagmiWrapper";
import LockScreen from "@/components/LockScreen";
import getWeb3Library from "@/utils/mainnet/providers";
import "@/style/main.css";

import dynamic from "next/dynamic";
import { ApplicationContextProvider } from "@/contexts/ApplicationContextProvider";
import { BondContextProvider } from "@/contexts/BondContextProvider";
import { LendingPoolContextProvider } from "@/contexts/LendingPoolContextProvider";
import { ProtectionPoolContextProvider } from "@/contexts/ProtectionPoolContextProvider";
import { UserContextProvider } from "@/contexts/UserContextProvider";

import UnderMaintenance from "@/components/UnderMaintenance";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

// Record a pageview when route changes
Router.events.on("routeChangeComplete", (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      url: "https://amazing-protected.carapace.finance/script.js"
    });
  }, []);

  return process.env.NEXT_PUBLIC_MAINTENANCE === "true" ? (
    <UnderMaintenance />
  ) : (
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
          <WagmiWrapper>
            {/* TODO: Relpce web3react to wagmi */}
            <ApplicationContextProvider>
              <ProtectionPoolContextProvider>
                <LendingPoolContextProvider>
                  <BondContextProvider>
                    <UserContextProvider>
                      <LockScreen />
                      <Header />
                      <Component {...pageProps} />
                      <Footer />
                    </UserContextProvider>
                  </BondContextProvider>
                </LendingPoolContextProvider>
              </ProtectionPoolContextProvider>
            </ApplicationContextProvider>
          </WagmiWrapper>
        </Web3ReactProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
