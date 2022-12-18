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

function App({ Component, pageProps }) {
  return (
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
  );
}

export default App;
