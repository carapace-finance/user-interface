import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
  menu: {
    width: "100vw"
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
  },
  chip: {
    margin: theme.spacing(0, 1)
  }
}));

const NavBar = () => {
  const classes = useStyles();
  const router = useRouter();
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      disableScrollLock
      getContentAnchorEl={null}
      open={isMenuOpen}
      onClose={handleMenuClose}
      elevation={2}
      className={classes.menu}
    >
      <>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="body1">
              Balance
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: "8px"
              }}
            >
              <Image
                src="/dai.svg"
                alt="dai"
                width="35px"
                height="22px"
                unoptimized
              />
            </Typography>
          </CardContent>
        </Card>
      </>
    </Menu>
  );

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
              <Chip
                variant="outlined"
                color="default"
                onClick={handleProfileMenuOpen}
                icon={
                  <Image
                    unoptimized
                    src="/icon.png"
                    width="30px"
                    height="30px"
                    objectFit="contain"
                    alt="Account photo"
                  />
                }
                label={"test"}
                className={classes.chip}
              />
            </>
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
      {renderMenu}
      <ConnectWalletPopup
        open={connectWalletOpen}
        onClose={() => setConnectWalletOpen(false)}
      />
    </AppBar>
  );
};

export default NavBar;
