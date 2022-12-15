import LoadingButton from "@mui/lab/LoadingButton";
import {
  IconButton as MuiIconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField
} from "@mui/material";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { formatAddress } from "@utils/utils";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import {
  formatUSDC,
  convertNumberToUSDC,
  convertUSDCToNumber,
  USDC_FORMAT
} from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import numeral from "numeral";

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
      protectionPoolService
        .getRequestedWithdrawalAmount(protectionPoolAddress)
        .then((balance) => {
          setWithdrawableAmount(convertUSDCToNumber(balance));
        });
    }
  }, [open]);

  const setMaxAmount = async () => {
    setAmount(withdrawableAmount);
  };

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log("The withdrawal transaction failed");
    setError("Failed to withdraw...");
  };

  const withdraw = async () => {
    setLoading(true);

    try {
      const tx = await protectionPoolService.withdraw(
        protectionPoolAddress,
        convertNumberToUSDC(amount)
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setLoading(false);
        console.log("The withdrawal transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully withdrew ${amount} USDC from the protection pool!`
        );
        setTimeout(() => {
          resetInputs();
          onClose();
        }, 2000);
      } else {
        onError(receipt);
      }
    } catch (e) {
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
        Withdraw
        <MuiIconButton
          onClick={onClose}
          color="primary"
          className="absolute top-0 right-0"
          size="small"
        >
          X
        </MuiIconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex justify-left mb-3">
          Protection Pool:{formatAddress(protectionPoolAddress)}
        </div>
        <h4>Withdraw Amount</h4>
        <div className="flex justify-center">
          <TextField
            type="number"
            placeholder={"0"}
            variant="outlined"
            size="medium"
            InputProps={{
              inputProps: { min: "0" },
              startAdornment: (
                <InputAdornment position="start">USDC</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={!protectionPoolService}
                    onClick={setMaxAmount}
                    size="sm"
                  >
                    Max
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={amount}
            onChange={(e) =>
              setAmount(parseFloat(e.target.value))
            }
          />
        </div>
        <p>
          Withdrawable Amount:{" "}
          {numeral(withdrawableAmount).format(USDC_FORMAT) + " USDC"}
        </p>
        <h4 className="flex justify-left mb-4">Estimated Stats</h4>
        <p className="flex justify-left mb-4">
          Expected Network Fees
          <Tooltip content="test test" placement="right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </Tooltip>
        </p>
        <p>$10.00</p>
        <LoadingButton
          style={{
            textTransform: "none",
            marginTop: "1.5em",
            marginBottom: "1.5em"
          }}
          disabled={
            !protectionPoolService ||
            !protectionPoolAddress ||
            !amount ||
            amount === 0 ||
            amount > withdrawableAmount
          }
          onClick={withdraw}
          loading={loading}
          variant="outlined"
        >
          Confirm Withdrawal
        </LoadingButton>
        <div>
          By clicking &quot;Confirm Withdrawal&quot;, you agree to
          Carapace&apos;s Terms of Service and acknowledge that you have read
          and understand the Carapace protocol disclaimer.
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

export default WithdrawalPopUp;
