import { Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { IconButton } from "@material-tailwind/react";
import { useState } from "react";
import { formatAddress } from "@utils/utils";

const WithdrawalRequestPopUp = (props) => {
  const { open, onClose, protectionPoolAddress } = props;
  const [amount, setAmount] = useState("");
  const [requestableAmount, setRequestableAmount] = useState("");

  const requestedWithdrawal = async () => { 
    onClose();
  };
  const setMaxAmount = async () => { setAmount(requestableAmount) };

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
        <IconButton className="absolute top-0 right-0" aria-label="close" onClick={onClose} size="sm" color="white">x</IconButton>
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
                <InputAdornment position="end"><IconButton aria-label="close" onClick={setMaxAmount} size="sm">Max</IconButton></InputAdornment>
              )
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={requestedWithdrawal}
        >
          Confirm Withdrawal Request
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestPopUp;
