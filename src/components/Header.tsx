import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Account from "@components/Account";
import ConnectWalletPopup from "@components/ConnectWalletPopup";
import Network from "@components/Network";

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
  const classes = useStyles();
  const router = useRouter();
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);

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
              src="/logo-dark.png"
              alt=""
              className={classes.logo}
              height="30px"
              width="124px"
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
            <Network />
            <Account />
          </div>
        </Toolbar>
      </Container>
      <ConnectWalletPopup
        open={connectWalletOpen}
        onClose={() => setConnectWalletOpen(false)}
      />
    </AppBar>
  );
};

export default Header;
