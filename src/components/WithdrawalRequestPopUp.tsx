import { Dialog, DialogContent, DialogTitle, InputAdornment, TextField, IconButton as MuiIconButton } from "@mui/material";
import { IconButton } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { formatAddress } from "@utils/utils";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { convertNumberToUSDC, convertUSDCToNumber, formatUSDC, parseUSDC, USDC_FORMAT } from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import { LoadingButton } from "@mui/lab";
import numeral from "numeral";

const WithdrawalRequestPopUp = (props) => {
  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, protectionPoolAddress } = props;
  const [amount, setAmount] = useState(0);
  const [requestableAmount, setRequestableAmount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setAmount(0);
    setRequestableAmount(0);
    setSuccessMessage("");
    setError("");
    setLoading(false);
  };
  
  useEffect(() => {
    reset();

    if (protectionPoolService && protectionPoolAddress) {
      console.log("Getting pool balance...");
      protectionPoolService.getSTokenUnderlyingBalance(protectionPoolAddress)
        .then((balance) => { setRequestableAmount(convertUSDCToNumber(balance)) });
    }
  }, [open]);
  
  const setMaxAmount = async () => { setAmount(requestableAmount) };

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log('The requestWithdrawal transaction failed');
    setError("Failed to request withdrawal...");
    setLoading(false);
  };
  
  const requestedWithdrawal = async () => {
    setLoading(true);

    try {
      const tx = await protectionPoolService.requestWithdrawal(protectionPoolAddress, convertNumberToUSDC(amount));
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setLoading(false);
        console.log('The requestWithdrawal transaction was successful');
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(`You successfully requested to withdraw ${amount} USDC from the protection pool!`);
        setTimeout(() => {
          reset();
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
      maxWidth="lg"
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "8px"
        }
      }}
    >
      <DialogTitle>
        Withdrawal Request
        <MuiIconButton onClick={onClose} color="primary" className="absolute top-0 right-0" size="small">X</MuiIconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex justify-left mb-3">Protection Pool:{formatAddress(protectionPoolAddress)}</div>
        <div className="flex justify-left mb-3"></div>
        <div className="flex justify-center">
          <TextField
            type="number"
            placeholder={"0.0"}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">USDC</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end"><IconButton disabled={!protectionPoolService} onClick={setMaxAmount} size="sm">Max</IconButton></InputAdornment>
              )
            }}
            value={amount}
            onChange={(e) => e.target.value ? setAmount(parseFloat(e.target.value)) : 0}
          />
        </div>
        <p>Requestable Amount: {numeral(requestableAmount).format(USDC_FORMAT) + " USDC"}</p>
        <LoadingButton style={{ textTransform: "none", marginTop: "1.5em", marginBottom: "1.5em" }}
            onClick={requestedWithdrawal}
            disabled={!protectionPoolService || !protectionPoolAddress || !amount || amount > requestableAmount}
            loading={loading}
            variant="outlined"
          >
            Confirm Withdrawal Request
          </LoadingButton>
        <div>
          By clicking &quot;Confirm Withdrawal Request&quot;, you agree to Carapace&apos;s
          Terms of Service and acknowledge that you have read and understand the
          Carapace protocol disclaimer.
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

export default WithdrawalRequestPopUp;
