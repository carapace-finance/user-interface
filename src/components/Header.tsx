import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useWeb3React } from "@web3-react/core";

import ConnectWalletPopup from "@components/ConnectWalletPopup";

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
            <Account />
            <Network />
            <Button
              color="primary"
              onClick={() => setConnectWalletOpen(true)}
              variant="outlined"
            >
              Connect Wallet
            </Button>
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

function Account() {
  const { account } = useWeb3React();

  return (
    <>
      <span>Account:</span>
      <span>
        {account === null
          ? "-"
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ""}
      </span>
    </>
  );
}

function Network() {
  const { active, error } = useWeb3React();
  const { chainId } = useWeb3React();

  return (
    <>
      <span>{chainId === 1 ? "Mainnet" : "Testnet"}</span>
      <span>{active ? "🟢" : error ? "🔴" : "🟠"}</span>
    </>
  );
}

export default Header;
