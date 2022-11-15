import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getWeb3Library from "../utils/providers";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@material-tailwind/react";
import "@style/main.css";

import dynamic from "next/dynamic";
const Header = dynamic(() => import("@components/Header"), { ssr: false });
const Footer = dynamic(() => import("@components/Footer"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getWeb3Library}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Web3ReactProvider>
    </ThemeProvider>
  );
}
export default MyApp;
