import { Web3ReactProvider } from "@web3-react/core";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@material-tailwind/react";
import getWeb3Library from "../utils/mainnet/providers";
import "@style/main.css";

import dynamic from "next/dynamic";
const Header = dynamic(() => import("@components/Header"), { ssr: false });
const Footer = dynamic(() => import("@components/Footer"), { ssr: false });

function App({ Component, pageProps, tenderlyAccessKey }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getWeb3Library}>
        <Header tenderlyAccessKey={tenderlyAccessKey} />
        <Component {...pageProps} />
        <Footer />
      </Web3ReactProvider>
    </ThemeProvider>
  );
}
export default MyApp;
