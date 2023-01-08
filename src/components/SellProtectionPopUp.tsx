import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
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
import { Tooltip } from "@material-tailwind/react";
import assets from "src/assets";

// Presentational component for handling trades
const SellProtectionPopUp = (props) => {
  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, amount, protectionPoolAddress, estimatedAPY } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expectedNetworkFee, setExpectedNetworkFee] = useState(5.78);

  const router = useRouter();

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
    console.log("The deposit transaction failed");
    setError("Failed to sell protection...");
    setLoading(false);
  };

  // Function passed into 'onClick' of 'Sell Protection' button
  const sellProtection = async () => {
    setLoading(true);
    setError("");

    try {
      const tx = await protectionPoolService.deposit(
        protectionPoolAddress,
        convertNumberToUSDC(parseFloat(amount))
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("The deposit transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully deposited ${amount} USDC in to the protection pool!`
        );
        setTimeout(() => {
          onClose();
          router.push("/portfolio");
          setLoading(false);
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
      className="inset-x-36"
      disableScrollLock
      open={open}
      onClose={loading ? null : onClose}
      PaperProps={{
        style: {
          borderRadius: "10px"
        }
      }}
    >
      <div className="flex justify-end mr-4">
      <IconButton onClick={loading ? null : onClose}>
          <span className="text-black">×</span>
        </IconButton>
      </div>
      <DialogTitle className="mt-6">Deposit</DialogTitle>
      <DialogContent className="mb-4">
        <div>
          <div className="flex justify-start">
            {renderFieldAndValue("Name", "Goldfinch Protection Pool #1")}
            <div className="-ml-40 mt-1">
              <img
                src={assets.goldfinch.src}
                alt="carapace"
                height="16"
                width="16"
              />
            </div>
          </div>
          {renderFieldAndValue(
            "Deposit Amount",
            numeral(amount).format(USDC_FORMAT) + " USDC"
          )}
        </div>
        <Divider />
        <div className="mb-8 pt-4">
          <Typography
            className="flex justify-left pb-5 text-gray-900 text-base font-medium"
            variant="subtitle2"
          >
            Estimated Stats
          </Typography>
          <Typography className="flex justify-between pb-3" variant="caption">
            <div className="text-gray-500 text-sm flex items-center">
              Expected APY:
              <div className="pl-2">
                <Tooltip content="test test" placement="top">
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
            <div className="text-sm">{estimatedAPY}</div>
          </Typography>
          <Typography className="flex justify-between mb-4" variant="caption">
            <div className="text-gray-500 text-sm flex items-center">
              Expected Network Fees:
              <div className="pl-2">
                <Tooltip content="test test" placement="top">
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
            <div className="text-sm">
              ${numeral(expectedNetworkFee).format("0.00")}
            </div>
          </Typography>
        </div>
        <div>
          <button
            className="text-white text-base bg-customBlue px-8 py-4 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sellProtection}
            disabled={
              loading ||
              !protectionPoolService ||
              !protectionPoolAddress ||
              !amount
            }
          >
            Confirm Deposit
          </button>
          <div className="flex"></div>
          <LoadingButton loading={loading}></LoadingButton>
        </div>
        <div>
          <div className="text-sm">
            By clicking &quot;Confirm Deposit&quot;, you agree to
            Carapace&apos;s&nbsp;
            <span className="underline">Terms of Service&nbsp;</span>
            and acknowledge that you have read and understand the&nbsp;
            <span className="underline">Carapace protocol disclaimer.</span>
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

const renderFieldAndValue = (fieldLabel, fieldValue) => {
  return (
    <div>
      <Typography
        className="flex justify-left text-gray-900 text-base font-medium mb-5"
        variant="subtitle2"
      >
        <div>{fieldLabel}</div>
      </Typography>
      <div className="flex justify-left mb-4">{fieldValue}</div>
    </div>
  );
};

export default SellProtectionPopUp;
