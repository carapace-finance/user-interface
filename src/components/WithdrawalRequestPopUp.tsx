import { Dialog, DialogContent, DialogTitle, InputAdornment, TextField, IconButton as MuiIconButton } from "@mui/material";
import { IconButton } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { formatAddress } from "@utils/utils";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { formatUSDC, parseUSDC } from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";

const WithdrawalRequestPopUp = (props) => {
  const { open, onClose, protectionPoolAddress } = props;
  const [amount, setAmount] = useState("");
  const [requestableAmount, setRequestableAmount] = useState("");
  const { protectionPoolService } = useContext(ApplicationContext);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log('The requestWithdrawal transaction failed');
    setError("Failed to request withdrawal...");
  };
  
  const requestedWithdrawal = async () => {
    try {
      const tx = await protectionPoolService.requestWithdrawal(protectionPoolAddress, parseUSDC(amount));
      const receipt = await tx.wait();
      if (receipt.status === 1) { 
        console.log('The requestWithdrawal transaction was successful');
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(`You successfully requested to withdraw ${amount} USDC from the protection pool!`);
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

  const setMaxAmount = async () => { setAmount(requestableAmount) };

  useEffect(() => {
    setAmount("");
    setRequestableAmount("");
    setSuccessMessage("");
    setError("");

    if (protectionPoolService && protectionPoolAddress) {
      console.log("Getting pool balance...");
      protectionPoolService.getSTokenUnderlyingBalance(protectionPoolAddress).then((balance) => { setRequestableAmount(formatUSDC(balance))});
    }
   }, [protectionPoolService, protectionPoolAddress]);

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
        <div className="flex justify-left mb-3">Requestable Amount: {requestableAmount}</div>
        <div className="flex justify-center mb-3">
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
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          disabled={!protectionPoolService || !protectionPoolAddress || !amount || amount === "0" || amount > requestableAmount}
          onClick={requestedWithdrawal}
        >
          Confirm Withdrawal Request
        </button>
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
