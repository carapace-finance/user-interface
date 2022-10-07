import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";

import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "hidden",
    borderRadius: theme.spacing(10),
    height: "max-content",
    width: "max-content",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      height: "max-content",
      width: "max-content",
      minWidth: theme.spacing(60),
      maxHeight: "90%",
      overflowY: "scroll"
    }
  },
  description: {
    maxWidth: theme.spacing(55)
  },
  content: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    marginBottom: theme.spacing(2),
    alignItems: "center"
  },
  fields: {
    display: "flex",
    justifyContent: "space-between"
  },
  button: {
    width: "100%",
    height: theme.spacing(6),
    margin: theme.spacing(2, 2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1)
  },
  dropdown: {
    minWidth: theme.spacing(23)
  },
  info: {
    textAlign: "center"
  },
  actions: {
    float: "right",
    width: "100%",
    marginTop: theme.spacing(-1)
  }
}));

// Presentational component for handling trades
const ClaimPopup = (props) => {
  const classes = useStyles();
  const { open, onClose } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset
    setSuccessMessage("");
    setError("");
  }, [open]);

  // Function passed into 'onClick'
  const executeClaim = async () => {
    setError("");
    let message = "";
    try {
    } catch (e) {
      const err = JSON.stringify(JSON.stringify(e.message));
      console.log("Error", err);
      return setError(err);
    }

    // Show success message for 2 seconds before closing popup
    setSuccessMessage(message);
    setTimeout(() => {
      onClose();
    }, 2000);
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
      <DialogTitle>
        <Typography gutterBottom variant="h6"></Typography>
        <Typography
          gutterBottom
          variant="body2"
          className={classes.description}
        ></Typography>
      </DialogTitle>
      <DialogContent>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <>
          <DialogContent className={classes.content}>
            <div>
              <Typography gutterBottom variant="subtitle2"></Typography>
              <Typography variant="body2"></Typography>
            </div>
            <SwapHorizIcon />
            <div>
              <Typography gutterBottom variant="subtitle2">
                Amount in DAI
              </Typography>
              <Typography variant="body2"></Typography>
            </div>
          </DialogContent>
          <DialogContent className={classes.info}>
            <Typography variant="subtitle2"></Typography>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={false}
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={console.log()}
            ></Button>
          </DialogActions>
        </>
        <Typography
          style={{ textAlign: "center" }}
          variant="body2"
        ></Typography>
      </DialogContent>
      <SuccessPopup
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Dialog>
  );
};

export default ClaimPopup;
