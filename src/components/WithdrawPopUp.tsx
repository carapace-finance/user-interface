import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton as MuiIconButton, Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { IconButton } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { formatAddress } from "@utils/utils";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { formatUSDC, convertNumberToUSDC, convertUSDCToNumber } from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";

const WithdrawalPopUp = (props) => {
  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, protectionPoolAddress } = props;
  const [amount, setAmount] = useState(0);
  const [withdrawableAmount, setWithdrawableAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const resetInputs = () => {
    setAmount(0);
    setWithdrawableAmount(0);
    setSuccessMessage("");
    setError("");
  };

  // fetch withdrawable amount on each open
  useEffect(() => {
    resetInputs();

    if (protectionPoolService && protectionPoolAddress) {
      console.log("Getting user's withdrawal request...");
      protectionPoolService.getRequestedWithdrawalAmount(protectionPoolAddress)
        .then((balance) => { setWithdrawableAmount(balance) });
    }
  }, [open]);
  
  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log('The withdrawal transaction failed');
    setError("Failed to withdraw...");
  };
  
  const withdraw = async () => {
    setLoading(true);

    try {
      const tx = await protectionPoolService.withdraw(protectionPoolAddress, convertNumberToUSDC(amount));
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setLoading(false);
        console.log('The withdrawal transaction was successful');
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(`You successfully withdrew ${amount} USDC from the protection pool!`);
        setTimeout(() => {
          resetInputs();
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

  const setMaxAmount = async () => { setAmount(convertUSDCToNumber(withdrawableAmount)) };

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
      <DialogTitle>Withdraw
        <MuiIconButton onClick={onClose} color="primary" className="absolute top-0 right-0" size="small">X</MuiIconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex justify-left mb-3">Protection Pool:{formatAddress(protectionPoolAddress)}</div>
        <div className="flex justify-left mb-3">Withdrawable Amount: {formatUSDC(withdrawableAmount)}</div>
        <div className="flex justify-center mb-3">
          <TextField
            type="number"
            placeholder={"0"}
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
        <LoadingButton style={{ textTransform: "none" }}
          disabled={!protectionPoolService || !protectionPoolAddress || !amount || amount === 0 || convertNumberToUSDC(amount) > withdrawableAmount}
          onClick={withdraw}
          loading={loading}
          variant="outlined"
        >
          Confirm Withdraw
        </LoadingButton>
      </DialogContent>
      <SuccessPopup
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Dialog>
  );
};

export default WithdrawalPopUp;
