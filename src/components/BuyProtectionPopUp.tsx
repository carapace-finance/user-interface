import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import numeral from "numeral";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import {
  convertNumberToUSDC,
  convertUSDCToNumber,
  USDC_FORMAT
} from "@utils/usdc";
import { formatAddress, getDaysInSeconds } from "@utils/utils";
import { Tooltip } from "@material-tailwind/react";
import assets from "src/assets";

const BuyProtectionPopUp = (props) => {
  const {
    open,
    onClose,
    protectionAmount,
    protectionDurationInDays,
    tokenId,
    premiumAmount,
    lendingPoolAddress,
    protectionPoolAddress
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

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log("The buy protection transaction failed");
    setError("Failed to buy protection...");
    setLoading(false);
  };

  // Function passed into 'onClick' of 'Buy Protection' button
  const buyProtection = async () => {
    setLoading(true);
    setError("");

    try {
      const protectionPurchaseParams = {
        lendingPoolAddress: lendingPoolAddress,
        nftLpTokenId: tokenId,
        protectionAmount: convertNumberToUSDC(protectionAmount),
        protectionDurationInSeconds: getDaysInSeconds(protectionDurationInDays)
      };
      const tx = await protectionPoolService.buyProtection(
        protectionPoolAddress,
        protectionPurchaseParams
      );

      const receipt = await tx.wait();
      if (receipt.status === 1) {
        protectionPoolService.updateProtectionPurchaseByLendingPool(
          lendingPoolAddress,
          protectionPurchaseParams.protectionAmount
        );
        setLoading(false);
        console.log("The buy protection transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully bought protection for ${protectionDurationInDays} days!`
        );
        setTimeout(() => {
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
      <DialogTitle className="mt-6">
        Buy Protection
        <div>
          <IconButton
            onClick={onClose}
            className="absolute top-10 right-10 flex items-center w-6 h-6 rounded-full border-2 border-solid border-gray-300"
            color="primary"
            size="small"
          >
            <div className="text-black">
             ×
            </div>
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>
          <div>
            <div className="flex">
              {renderFieldAndValue(
                "Lending Pool",
                formatAddress(lendingPoolAddress)
              )}
              <div className="ml-2 mt-1">
              <img
                src={assets.goldfinch.src}
                alt="carapace"
                height="16"
                width="16"
                className=""
              />
              </div>
            </div>
            {renderFieldAndValue(
              "Protection Amount",
              numeral(protectionAmount).format(USDC_FORMAT) + " USDC"
            )}
            {renderFieldAndValue("Duration", protectionDurationInDays + " Days")}
            {renderFieldAndValue("Token Id", tokenId)}
            {renderFieldAndValue(
              "Premium Price",
              numeral(premiumAmount).format(USDC_FORMAT) + " USDC"
            )}
          </div>
          <Divider className="mb-4" />
          <div className="mb-8">
            <Typography className="flex justify-left mb-4 text-customGrey text-base font-bold" variant="subtitle2">
              Estimated Stats
            </Typography>
            <Typography className="flex justify-between mb-2" variant="caption">
              <div className="text-gray-500 text-sm flex items-center">
                Expected Adjusted Yield:
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
                {adjustedYield}
              </div>
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
          <LoadingButton
            className="mb-8 rounded-xl py-5 px-8 bg-customBlue hover:cursor-pointer"
            style={{ textTransform: "none" }}
            onClick={buyProtection}
            disabled={
              !protectionPoolService ||
              !protectionPoolAddress ||
              !protectionAmount ||
              !protectionDurationInDays ||
              !tokenId ||
              !lendingPoolAddress
            }
            loading={loading}
            variant="outlined"
          >
            <div className="text-white text-base">
              Confirm Protection Purchase
            </div>
          </LoadingButton>
          <div className="text-xs">
            <div className="flex">
            <p>By clicking &quot;Confirm Protection Purchase&quot;, you agree toCarapace&apos;s&nbsp; </p>
            <p className="underline">Terms of Service</p>
            </div>
            <div className="flex">
              <p>and acknowledge that you have read and understand the&nbsp; </p>
              <p className="underline">Carapace protocol disclaimer.</p>
            </div>
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
      <Typography className="flex justify-left text-customGrey text-base font-bold mb-5" variant="subtitle2">
        <div className="text-base">
        {fieldLabel}
        </div>
      </Typography>
      <div className="flex justify-left mb-4">{fieldValue}</div>
    </div>
  );
};

export default BuyProtectionPopUp;
