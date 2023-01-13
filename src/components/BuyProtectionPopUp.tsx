import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import { UserContext } from "@contexts/UserContextProvider";
import {
  convertNumberToUSDC,
  convertUSDCToNumber,
  USDC_FORMAT
} from "@utils/usdc";
import { getDaysInSeconds } from "@utils/utils";
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
    calculatingPremiumPrice,
    setPremiumPrice,
    lendingPoolAddress,
    protectionPoolAddress,
    name,
    adjustedYields
  } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expectedNetworkFee, setExpectedNetworkFee] = useState(5.78);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const { protectionPoolService } = useContext(ApplicationContext);
  const { updateUserUsdcBalance } = useContext(UserContext);

  const router = useRouter();

  const reset = () => {
    setSuccessMessage("");
    setError("");
    setPremiumPrice(0);
    setLoading(false);
  };

  useEffect(reset, [open]);

  useEffect(() => {
    (async () => {
      setUsdcBalance(convertUSDCToNumber(await updateUserUsdcBalance()));
    })();
  }, [open]);

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log("The buy protection transaction failed");
    setError("Failed to buy protection...");
    setTimeout(() => {
      reset();
    }, 2000);
  };

  const hasEnoughUsdcBalance = () => {
    if (premiumAmount > usdcBalance) {
      return false;
    } else {
      return true;
    }
  };

  // Function passed into 'onClick' of 'Buy Protection' button
  const buyProtection = async () => {
    setLoading(true);
    setError("");

    try {
      const protectionPurchaseParams = {
        lendingPoolAddress: lendingPoolAddress,
        nftLpTokenId: tokenId,
        protectionAmount: convertNumberToUSDC(parseFloat(protectionAmount)),
        protectionDurationInSeconds: getDaysInSeconds(protectionDurationInDays)
      };
      const tx = await protectionPoolService.buyProtection(
        protectionPoolAddress,
        protectionPurchaseParams,
        convertNumberToUSDC(premiumAmount)
      );

      const receipt = await tx.wait();
      if (receipt.status === 1) {
        protectionPoolService.updateProtectionPurchaseByLendingPool(
          lendingPoolAddress,
          protectionPurchaseParams.protectionAmount
        );
        console.log("The buy protection transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully bought protection for ${protectionDurationInDays} days!`
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
      <DialogTitle className="mt-6">Buy Protection</DialogTitle>
      <DialogContent className="mb-4">
        <div>
          <div>
            <div>
              {renderFieldAndValue(
                "Premium Price",
                calculatingPremiumPrice ? (
                  <div>
                    Calculating Premium Price...
                    <LoadingButton
                      loading={calculatingPremiumPrice}
                    ></LoadingButton>
                  </div>
                ) : (
                  numeral(premiumAmount).format(USDC_FORMAT) + " USDC"
                )
              )}
              {hasEnoughUsdcBalance() ? null : (
                <h5 className="block text-left text-customPink text-base font-normal">
                  You don&apos;t have enough USDC balance:&nbsp;
                  {numeral(usdcBalance).format(USDC_FORMAT)}&nbsp;USDC
                </h5>
              )}
            </div>
            <div className="flex">
              {renderFieldAndValue("Lending Pool", name)}
              <div className="ml-2 mt-5">
                <img
                  src={assets.goldfinch.src}
                  alt="carapace"
                  height="16"
                  width="16"
                />
              </div>
            </div>
            {renderFieldAndValue(
              "Protection Amount",
              numeral(protectionAmount).format(USDC_FORMAT) + " USDC"
            )}
            {renderFieldAndValue(
              "Duration",
              protectionDurationInDays + " Days"
            )}
            {renderFieldAndValue("Token Id", tokenId)}
          </div>
          <Divider className="mb-8" />
          <div className="mt-4">
            <Typography
              className="flex justify-left text-customGrey text-base font-bold"
              variant="subtitle2"
            >
              <p className="text-base">Estimated Stats</p>
            </Typography>
            <Typography
              className="flex justify-between pb-3 mt-4"
              variant="caption"
            >
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
              <div className="text-sm">{adjustedYields}</div>
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
          <button
            className={`text-white text-base bg-customBlue px-8 py-4 mt-8 rounded-md cursor-pointer min-w-[330px] ${loading ? 'disabled:opacity-90' : 'disabled:opacity-50'} disabled:cursor-not-allowed`}
            onClick={buyProtection}
            disabled={
              loading ||
              !protectionPoolService ||
              !protectionPoolAddress ||
              !protectionAmount ||
              calculatingPremiumPrice ||
              !protectionDurationInDays ||
              !tokenId ||
              !lendingPoolAddress ||
              !hasEnoughUsdcBalance() ||
              premiumAmount === 0
            }
          >{loading ? <LoadingButton loading={loading}></LoadingButton> : "Confirm Protection Purchase"}
          </button>
          <div className="flex"></div>
          <LoadingButton loading={loading}></LoadingButton>
          <div className="text-sm">
            By clicking &quot;Confirm Protection Purchase&quot;, you agree to
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
        className="flex justify-left text-customGrey text-base font-bold"
        variant="subtitle2"
      >
        <div className="text-base mt-4">{fieldLabel}</div>
      </Typography>
      <div className="flex justify-left">{fieldValue}</div>
    </div>
  );
};

export default BuyProtectionPopUp;
