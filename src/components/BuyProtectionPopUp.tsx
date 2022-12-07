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
import { getDaysInSeconds } from "@utils/utils";

// Presentational component for handling buy protection
const BuyProtectionPopUp = (props) => {
  const {
    open,
    onClose,
    protectionAmount,
    protectionDurationInDays,
    tokenId,
    lendingPoolAddress,
    protectionPoolAddress,
    USDCBalance
  } = props;
  const [tab, setTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [priceInput, setPriceInput] = useState<string>();
  const [priceOutput, setPriceOutput] = useState<string>();
  const quantityRef = useRef<HTMLInputElement>();
  const { protectionPoolService } = useContext(ApplicationContext);

  useEffect(() => {
    // Reset
    setPriceInput(undefined);
    setPriceOutput(undefined);
    setSuccessMessage("");
    setError("");
    setTab(0);
  }, [open]);

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log('The buy protection transaction failed');
    setError("Failed to buy protection...");
  };

  // Function passed into 'onClick' of 'Buy Protection' button
  const buyProtection = async () => {
    setError("");

    try {
      const tx = await protectionPoolService.buyProtection(protectionPoolAddress, {
        lendingPoolAddress: lendingPoolAddress,
        nftLpTokenId: tokenId,
        protectionAmount: parseUSDC(protectionAmount),
        protectionDurationInSeconds: getDaysInSeconds(protectionDurationInDays)
      });

      const receipt = await tx.wait();
      if (receipt.status === 1) { 
        console.log('The buy protection transaction was successful');
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(`You successfully bought protection for ${protectionDurationInDays} days!`);
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
      <DialogTitle>Buy Protection</DialogTitle>
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
                onClick={buyProtection}
                disabled={!protectionPoolService || !priceInput || priceInput === "0"}
              >
                Buy protection
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

export default BuyProtectionPopUp;
