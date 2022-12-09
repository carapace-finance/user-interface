import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from "@mui/material";
import numeral from "numeral";

import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { convertNumberToUSDC, parseUSDC, USDC_FORMAT } from "@utils/usdc";
import { formatAddress } from "@utils/utils";
import { LoadingButton } from "@mui/lab";

// Presentational component for handling trades
const SellProtectionPopUp = (props) => {
  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, amount, protectionPoolAddress } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expectedYield, setExpectedYield] = useState("18 - 25%");
  const [expectedNetworkFee, setExpectedNetworkFee] = useState(5.78);

 const reset = () => {
    setSuccessMessage("");
    setError("");
    setLoading(false);
  };

  useEffect(reset, [open]);

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log('The deposit transaction failed');
    setError("Failed to sell protection...");
    setLoading(false);
  };

  // Function passed into 'onClick' of 'Sell Protection' button
  const sellProtection = async () => {
    setLoading(true);
    setError("");

    try {
      const tx = await protectionPoolService.deposit(protectionPoolAddress, convertNumberToUSDC(amount));
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setLoading(false);
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
      <DialogTitle>Deposit
        <IconButton onClick={onClose} className="absolute top-0 right-0" color="primary" size="small">X</IconButton>
      </DialogTitle>
      <DialogContent>
        {renderFieldAndValue("Protection Pool", formatAddress(protectionPoolAddress))}
        {renderFieldAndValue("Deposit Amount", numeral(amount).format(USDC_FORMAT) + " USDC")}
        
        <Divider className="mb-2" />
          
        <Typography className="flex justify-left mb-4" variant="subtitle2">Estimated Stats</Typography>
        <Typography className="flex justify-left mb-2" variant="caption">Expected APY: {expectedYield}</Typography>
        <Typography className="flex justify-left mb-4" variant="caption">Expected Network Fees: ${numeral(expectedNetworkFee).format("0.00")}</Typography>
        <LoadingButton style={{ textTransform: "none" }}
            onClick={sellProtection}
            disabled={!protectionPoolService || !protectionPoolAddress || !amount}
            loading={loading}
            variant="outlined"
        >
          Confirm Deposit
        </LoadingButton>
        <div>
          By clicking &quot;Confirm Deposit&quot;, you agree to Carapace&apos;s
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

const renderFieldAndValue = (fieldLabel, fieldValue) => {
  return (
    <div>
      <Typography className="flex justify-left" variant="subtitle2">{fieldLabel}</Typography>
      <div className="flex justify-left mb-4">{fieldValue}</div>
    </div>
  )
};

export default SellProtectionPopUp;
