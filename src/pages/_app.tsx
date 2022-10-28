import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import getWeb3Library from "../utils/providers";
import '@style/main.css'

import theme from "@utils/theme";

import dynamic from "next/dynamic";
const Header = dynamic(() => import("@components/Header"), { ssr: false });
const Footer = dynamic(() => import("@components/Footer"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getWeb3Library}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Web3ReactProvider>
    </MuiThemeProvider>
  );
}
export default MyApp;
