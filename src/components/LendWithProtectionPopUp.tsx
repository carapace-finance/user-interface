import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";

import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";

// Presentational component for handling trades
const LendWithProtectionPopUp = (props) => {
  const { open, onClose, USDCBalance } = props;
  const [tab, setTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [priceInput, setPriceInput] = useState<string>();
  const [priceOutput, setPriceOutput] = useState<string>();
  const quantityRef = useRef<HTMLInputElement>();

  useEffect(() => {
    // Reset
    setPriceInput(undefined);
    setPriceOutput(undefined);
    setSuccessMessage("");
    setError("");
    setTab(0);
  }, [open]);

  // Function passed into 'onClick'
  const executeTrade = async () => {
    setError("");
    let message = "";
    try {
      if (tab === 0) {
        message = `You successfully exchanged ${priceInput} USDC for ${priceOutput} Cover tokens`;
      } else {
        message = `You successfully staked ${priceInput} USDC in exchange for ${priceOutput} Prem tokens`;
      }
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
      <DialogTitle>Lend with Protection</DialogTitle>
      <DialogContent>
        <div>
          <IconButton aria-label="close" onClick={onClose} size="small">
            close
          </IconButton>
          {USDCBalance !== "0" ? (
            <>
              <DialogContent>
                <Typography gutterBottom variant="subtitle2">
                  Pay
                </Typography>
                <TextField
                  type="number"
                  placeholder={"0.0"}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">USDC</InputAdornment>
                    )
                  }}
                  onChange={(e) => {
                    const val = `${Math.abs(+e.target.value)}`;
                    setPriceInput(val);
                    setPriceOutput(val);
                  }}
                  inputRef={quantityRef}
                />
              </DialogContent>
              <button
                className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                onClick={executeTrade}
                disabled={!priceInput || priceInput === "0"}
              >
                Lend with protection
              </button>
            </>
          ) : (
            <Typography style={{ textAlign: "center" }} variant="body2">
              You don&apos;t have enough USDC to buy protection
            </Typography>
          )}
        </div>
      </DialogContent>
      <SuccessPopup
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Dialog>
  );
};

export default LendWithProtectionPopUp;
