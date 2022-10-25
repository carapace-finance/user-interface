import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { injected } from "../utils/connectors";

import ErrorPopup from "@components/ErrorPopup";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "hidden",
    borderRadius: theme.spacing(10),
    width: "40%",
    height: "40%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto"
  },
  title: {
    marginTop: theme.spacing(2),
    textAlign: "center"
  },
  field: {
    width: "100%"
  },
  button: {
    width: "100%",
    height: theme.spacing(6),
    margin: theme.spacing(2, 1),
    display: "flex",
    justifyContent: "space-between"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1)
  },
  dropdown: {
    minWidth: theme.spacing(23)
  }
}));

const ConnectWalletPopup = (props) => {
  const { activate } = useWeb3React();
  const classes = useStyles();
  const router = useRouter();
  const { open, onClose } = props;
  const [error, setError] = useState("");

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  const onConnect = async (wallet: string) => {
    setError("");
    switch (wallet) {
      case "metamask": {
        try {
          await connect();
          onClose();
          router.push("/");
        } catch (e) {
          console.log("Error", e);
        }
        break;
      }
    }
  };

  return (
    <Dialog
      className={classes.root}
      fullScreen
      fullWidth
      maxWidth="lg"
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "10px"
        }
      }}
    >
      <DialogTitle className={classes.title}>
        <Typography gutterBottom variant="h6">
          Connect to wallet
        </Typography>
        <Typography variant="body2">
          Please select a wallet to connect to this Dapp
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={async () => await onConnect("metamask")}
          startIcon={
            <Image
              src="/metamask.svg"
              alt="metamask"
              width="30px"
              height="30px"
              objectFit="contain"
            />
          }
        >
          <Typography variant="body2">MetaMask</Typography>
        </Button>
      </DialogContent>
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Dialog>
  );
};

export default ConnectWalletPopup;
