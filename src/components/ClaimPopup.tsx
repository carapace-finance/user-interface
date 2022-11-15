import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";

import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";

// Presentational component for handling trades
const ClaimPopup = (props) => {
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
        <Typography gutterBottom variant="body2"></Typography>
      </DialogTitle>
      <DialogContent>
        <IconButton aria-label="close" onClick={onClose} size="small">
          close
        </IconButton>
        <>
          <DialogContent>
            <div>
              <Typography gutterBottom variant="subtitle2"></Typography>
              <Typography variant="body2"></Typography>
            </div>
            <Typography>swap horizon</Typography>
            <div>
              <Typography gutterBottom variant="subtitle2">
                Amount in USDC
              </Typography>
              <Typography variant="body2"></Typography>
            </div>
          </DialogContent>
          <DialogContent>
            <Typography variant="subtitle2"></Typography>
          </DialogContent>
          <DialogActions>
            {/* <Button
              disabled={false}
              
              color="primary"
              variant="contained"
              onClick={console.log()}
            ></Button> */}
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
