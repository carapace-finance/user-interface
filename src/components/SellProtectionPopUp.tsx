import { useContext, useEffect, useRef, useState } from "react";
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
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { parseUSDC } from "@utils/usdc";

// Presentational component for handling trades
const SellProtectionPopUp = (props) => {
  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, amount, USDCBalance, protectionPoolAddress } = props;
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
  }, [open, protectionPoolAddress]);


  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log('The deposit transaction failed');
    setError("Failed to sell protection...");
  };

  // Function passed into 'onClick' of 'Sell Protection' button
  const sellProtection = async () => {
    setError("");

    try {
      const tx = await protectionPoolService.deposit(protectionPoolAddress, parseUSDC(amount));
      const receipt = await tx.wait();
      if (receipt.status === 1) { 
        console.log('The deposit transaction was successful');
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(`You successfully deposited ${amount} USDC in to the protection pool!`);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      else {
        onError(receipt);
      }
    }
    catch (e) {
      onError(e);
    }
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
      <DialogTitle>Sell Protection</DialogTitle>
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
                {amount}
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
                onClick={sellProtection}
                disabled={!protectionPoolService || !priceInput || priceInput === "0"}
              >
                Confirm Sell Protection
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

export default SellProtectionPopUp;
