import { useContext, useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import numeral from "numeral";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { parseUSDC, USDC_FORMAT } from "@utils/usdc";
import { formatAddress, getDaysInSeconds } from "@utils/utils";

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
    premiumAmount
  } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adjustedYield, setAdjustedYield] = useState("10 - 17%");
  const [expectedNetworkFee, setExpectedNetworkFee] = useState(5.78);
  const { protectionPoolService } = useContext(ApplicationContext);

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
    console.log('The buy protection transaction failed');
    setError("Failed to buy protection...");
    setLoading(false);
  };

  // Function passed into 'onClick' of 'Buy Protection' button
  const buyProtection = async () => {
    setLoading(true);
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
        setLoading(false);
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
      <DialogTitle>
        Buy Protection
        <IconButton onClick={onClose} className="absolute top-0 right-0" color="primary" size="small">X</IconButton>
      </DialogTitle>
      <DialogContent>
        <div>
          {renderFieldAndValue("Lending Pool", formatAddress(lendingPoolAddress))}
          {renderFieldAndValue("Protection Amount", numeral(protectionAmount).format(USDC_FORMAT) + " USDC")}
          {renderFieldAndValue("Protection Duration", protectionDurationInDays + " Days")}
          {renderFieldAndValue("Token Id", tokenId)}
          {renderFieldAndValue("Premium Price", numeral(premiumAmount).format(USDC_FORMAT) + " USDC")}
          
          <Divider className="mb-2"/>
          
          <Typography className="flex justify-left mb-4" variant="subtitle2">Estimated Stats</Typography>
          <Typography className="flex justify-left mb-2" variant="caption">Expected Adjusted Yield: {adjustedYield}</Typography>
          <Typography className="flex justify-left mb-4" variant="caption">Expected Network Fees: ${numeral(expectedNetworkFee).format("0.00")}</Typography>

          <LoadingButton style={{ textTransform: "none" }}
            onClick={buyProtection}
            disabled={!protectionPoolService || !protectionPoolAddress || !protectionAmount || !protectionDurationInDays || !tokenId || !lendingPoolAddress}
            loading={loading}
            variant="outlined"
          >
            Confirm Protection Purchase
          </LoadingButton>
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

export default BuyProtectionPopUp;
