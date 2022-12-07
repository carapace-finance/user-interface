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

const Header = dynamic(() => import("@components/Header"), { ssr: false });
const Footer = dynamic(() => import("@components/Footer"), { ssr: false });

function App({ Component, pageProps, tenderlyAccessKey }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getWeb3Library}>
        <ApplicationContextProvider>
          <LendingPoolContextProvider>
            <BondContextProvider>
              <ProtectionPoolContextProvider>
                <Header tenderlyAccessKey={tenderlyAccessKey} />
                <Component {...pageProps} />
                <Footer />
              </ProtectionPoolContextProvider>
            </BondContextProvider>
          </LendingPoolContextProvider>
        </ApplicationContextProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

App.getInitialProps = async () => {
  return {
    tenderlyAccessKey: process.env.TENDERLY_ACCESS_KEY // this value will be passed to the App component as props
  };
};

export default App;
