import {
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  IconButton as MuiIconButton,
  Divider,
} from "@mui/material";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { formatAddress } from "@utils/utils";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import {
  convertNumberToUSDC,
  convertUSDCToNumber,
  formatUSDC,
  parseUSDC,
  USDC_FORMAT
} from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import { LoadingButton } from "@mui/lab";
import numeral from "numeral";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  noBorder: {
    border: "none"
  }
}));

const WithdrawalRequestPopUp = (props) => {
  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, protectionPoolAddress } = props;
  const [amount, setAmount] = useState(0);
  const [requestableAmount, setRequestableAmount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

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
      protectionPoolService
        .getSTokenUnderlyingBalance(protectionPoolAddress)
        .then((balance) => {
          setRequestableAmount(convertUSDCToNumber(balance));
        });
    }
  }, [open]);

  const setMaxAmount = async () => {
    setAmount(requestableAmount);
  };

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log("The requestWithdrawal transaction failed");
    setError("Failed to request withdrawal...");
    setLoading(false);
  };

  const requestedWithdrawal = async () => {
    setLoading(true);

    try {
      const tx = await protectionPoolService.requestWithdrawal(
        protectionPoolAddress,
        convertNumberToUSDC(amount)
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setLoading(false);
        console.log("The requestWithdrawal transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully requested to withdraw ${amount} USDC from the protection pool!`
        );
        setTimeout(() => {
          reset();
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
      className="top-32 inset-x-36"
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "10px"
        }
      }}
    >
      <MuiIconButton
        onClick={onClose}
        color="primary"
        className="absolute top-10 right-10 flex items-center w-6 h-6 rounded-full border-2 border-solid border-gray-300"
        size="small"
      >
        <div className="text-black">
          ×
        </div>
      </MuiIconButton>
      <DialogTitle className="mt-6">
        Withdrawal Request
      </DialogTitle>
      <DialogContent>
        <div className="flex justify-left mb-3 text-base font-medium">
          Protection Pool{formatAddress(protectionPoolAddress)}
        </div>
        <div>
          <h4 className="text-left text-base font-medium mb-3">Request Amount</h4>
          <div className="bg-customLightGrey rounded-2xl mb-4 border">
            <div className="flex justify-center">
              <TextField
                type="number"
                placeholder={"0.0"}
                variant="outlined"
                size="medium"
                className="border-none w-full outline-none h-12"
                InputProps={{
                  classes: { notchedOutline: classes.noBorder },
                  startAdornment: (
                    <InputAdornment position="start" className="flex ">
                      <p className="text-customLightBlue pl-6">($)</p>
                      <p>USDC</p>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={!protectionPoolService}
                        onClick={setMaxAmount}
                        size="sm"
                        className="py-1 px-5 bg-transparent items-start text-customLightBlue border border-customLightBlue rounded-xl"
                      >
                        Max
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={amount}
                onChange={(e) =>
                  e.target.value ? setAmount(parseFloat(e.target.value)) : 0
                }
              />
            </div>
            <div className="text-right mr-5 mb-1">
              <p>
                Requestable Amount:{" "}
                {numeral(requestableAmount).format(USDC_FORMAT) + " USDC"}
              </p>
            </div>
          </div>
        </div>
        <Divider/>
        <div className="pt-4">
          <h4 className="flex justify-left mb-4 text-base font-medium">Estimated Stats</h4>
          <div className="flex justify-between mb-2">
            <div className="flex justify-left mb-4 text-gray-500 text-sm items-center">
              Expected Network Fees
              <div className="pl-2">
                <Tooltip content="test test" placement="right">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
            <div>
             <p className="text-sm">$10.00</p>
            </div>
          </div>
        </div>
        <LoadingButton
          style={{ textTransform: "none",backgroundColor:"#293C9A", padding: "16px 40px", borderRadius: "16px", marginBottom:"20px",cursor:"pointer" }}
          onClick={requestedWithdrawal}
          disabled={
            !protectionPoolService ||
            !protectionPoolAddress ||
            !amount ||
            amount > requestableAmount
          }
          loading={loading}
          variant="outlined"
        >
          <div className="text-white text-base">
           Confirm Withdrawal Request
          </div>
        </LoadingButton>
        <div className="text-xs">
          <div className="flex">
            <p>By clicking &quot;Confirm Withdrawal Request&quot;, you agree to Carapace&apos;s &nbsp;</p>
            <p className="underline">Terms of Service</p>
          </div>
          <div className="flex">
            <p>and acknowledge that you have read and understand the&nbsp;</p>
            <p className="underline">Carapace protocol disclaimer.</p>
          </div>
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
