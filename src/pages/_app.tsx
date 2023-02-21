import React, { useState, useEffect } from "react";
import Router from "next/router";
import * as Fathom from "fathom-client";
import { Web3ReactProvider } from "@web3-react/core";
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

import Mobile from "@components/Mobile";
import UnderMaintainance from "@components/UnderMaintainance";

// Record a pageview when route changes
Router.events.on("routeChangeComplete", (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

function App({ Component, pageProps }) {
  const [mobile, setMobile] = useState(undefined);

  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      url: "https://amazing-protected.carapace.finance/script.js"
    });

    const updateMobile = () => {
      setMobile(window.innerWidth < 576 ? true : false);
    };

    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => {
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  return typeof mobile !== "undefined" ? (
    mobile ? (
      <Mobile />
    ) : (process.env.NEXT_PUBLIC_MAINTENANCE === false ? (
      <ThemeProvider>
        <CssBaseline />
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
      </ThemeProvider>
    ) : <UnderMaintainance />)
  ) : null;
}

export default App;
