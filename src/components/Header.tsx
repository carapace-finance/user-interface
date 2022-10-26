import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { injected } from "../utils/connectors";
import assets from "../assets";
import { footerLinks } from "../constants";

import Account from "@components/Account";

const useStyles = makeStyles((theme) => ({
  appBar: {
    flexGrow: 1,
    width: "100%",
    height: theme.spacing(8),
    borderRadius: "0 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  toolBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  textButton: {
    padding: theme.spacing(0, 3),
    cursor: "pointer",
    opacity: 0.7,
    "&:hover": {
      opacity: 1
    }
  },
  logo: {
    "&:hover": {
      cursor: "pointer"
    },
    objectFit: "cover"
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}));

const Header = () => {
  const { active, activate, deactivate } = useWeb3React();
  const { chainId } = useWeb3React();
  const classes = useStyles();
  const router = useRouter();
  const [error, setError] = useState("");

  const onConnect = async (wallet: string) => {
    setError("");
    switch (wallet) {
      case "metamask": {
        try {
          await connect();
          router.push("/");
        } catch (e) {
          console.log("Error", e);
        }
        break;
      }
    }
  };

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <AppBar
      className={classes.appBar}
      elevation={0}
      position="static"
      color="transparent"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters variant="dense" className={classes.toolBar}>
          <Link href="/" passHref>
            <Image
              src={assets.headerLogo.src}
              alt=""
              className={classes.logo}
              height="32px"
              width="136px"
              unoptimized
            />
          </Link>
          <div className={classes.options}>
            <>
              <Link href="/buy_protection" passHref>
                <Typography
                  className={classes.textButton}
                  style={{
                    fontWeight: router.asPath === "/buy_protection" ? 500 : 400,
                    opacity: router.asPath === "/buy_protection" && 1
                  }}
                  variant="body1"
                >
                  Buy Protection
                </Typography>
              </Link>
            </>
            <>
              <Link href="/lend_with_protection" passHref>
                <Typography
                  className={classes.textButton}
                  style={{
                    fontWeight:
                      router.asPath === "/lend_with_protection" ? 500 : 400,
                    opacity: router.asPath === "/lend_with_protection" && 1
                  }}
                  variant="body1"
                >
                  Lend With Protection
                </Typography>
              </Link>
            </>
            <>
              <Link href="/sell_protection" passHref>
                <Typography
                  className={classes.textButton}
                  style={{
                    fontWeight:
                      router.asPath === "/sell_protection" ? 500 : 400,
                    opacity: router.asPath === "/sell_protection" && 1
                  }}
                  variant="body1"
                >
                  Sell Protection
                </Typography>
              </Link>
            </>
            <>
              <Link href="/dashboard" passHref>
                <Typography
                  className={classes.textButton}
                  style={{
                    fontWeight: router.asPath === "/dashboard" ? 500 : 400,
                    opacity: router.asPath === "/dashboard" && 1
                  }}
                  variant="body1"
                >
                  Dashboard
                </Typography>
              </Link>
            </>
            <Button
              color="primary"
              onClick={async () => await onConnect("metamask")}
              variant="outlined"
            >
              <span>
                {active && chainId === 1
                  ? "Mainnet"
                  : active && chainId != 1
                  ? "Not Mainnet"
                  : !active || error
                  ? "Connect Wallet"
                  : "Connect Wallet"}
              </span>
            </Button>
            {active ? (
              <Button
                color="primary"
                onClick={() => disconnect()}
                variant="outlined"
              >
                <span>{"Disconnect"}</span>
              </Button>
            ) : (
              ""
            )}
            <Account />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
