import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import numeral from "numeral";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import {
  convertNumberToUSDC,
  convertUSDCToNumber,
  USDC_FORMAT
} from "@utils/usdc";
import { X } from "lucide-react";
import useRenewProtection from "@/hooks/useRenewProtection";
import { BigNumber } from "ethers";

const RenewProtectionPopUp = (props) => {
  const {
    open,
    onClose
    // protectionAmount,
    // protectionDurationInDays,
    // tokenId,
    // premiumAmount,
    // calculatingPremiumPrice,
    // setPremiumPrice,
    // lendingPoolAddress,
    // protectionPoolAddress,
    // name,
    // adjustedYields
  } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expectedNetworkFee, setExpectedNetworkFee] = useState(5.78);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const { protectionPoolService, provider } = useContext(ApplicationContext);
  const { updateUserUsdcBalance } = useContext(UserContext);

  // TODO: update params
  const { prepareFn, writeFn, waitFn } = useRenewProtection(
    "0x8531EB39FbaEaB9Df406762aAE2C6005A898a092",
    "0xb26b42dd5771689d0a7faeea32825ff9710b9c11",
    "1000",
    "50"
  );

  const reset = () => {
    setSuccessMessage("");
    setError("");
    setLoading(false);
  };

  useEffect(reset, [open]);

  useEffect(() => {
    (async () => {
      provider &&
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
    if (1000 > usdcBalance) {
      return false;
    } else {
      return true;
    }
  };

  // Function passed into 'onClick' of 'Buy Protection' button
  const renewProtection = async () => {
    writeFn?.write();
    // setLoading(true);
    // setError("");
    // try {
    //   const protectionPurchaseParams = {
    //     lendingPoolAddress: lendingPoolAddress,
    //     nftLpTokenId: tokenId,
    //     protectionAmount: convertNumberToUSDC(parseFloat(protectionAmount)),
    //     protectionDurationInSeconds: getDaysInSeconds(protectionDurationInDays)
    //   };
    //   const tx = await protectionPoolService.buyProtection(
    //     protectionPoolAddress,
    //     protectionPurchaseParams,
    //     convertNumberToUSDC(premiumAmount)
    //   );

    //   const receipt = await tx.wait();
    //   if (receipt.status === 1) {
    //     protectionPoolService.updateProtectionPurchaseByLendingPool(
    //       lendingPoolAddress,
    //       protectionPurchaseParams.protectionAmount
    //     );
    //     console.log("The buy protection transaction was successful");
    //     // Show success message for 2 seconds before closing popup
    //     setSuccessMessage(
    //       `You successfully bought protection for ${protectionDurationInDays} days!`
    //     );
    //     setTimeout(() => {
    //       onClose();
    //       router.push("/portfolio");
    //       setLoading(false);
    //     }, 2000);
    //   } else {
    //     onError(receipt);
    //   }
    // } catch (e) {
    //   onError(e);
    // }
  };

  return (
    <Dialog
      className="inset-x-36"
      disableScrollLock
      open={open}
      onClose={loading ? null : onClose}
      PaperProps={{
        style: {
          borderRadius: "1rem"
        }
      }}
    >
      <div className="absolute top-3 right-3">
        <IconButton onClick={loading ? null : onClose}>
          <X className="text-black" size={18} />
        </IconButton>
      </div>
      <div className="mt-8" />
      <DialogTitle className="text-center mt-8">Renew Protection</DialogTitle>
      <DialogContent className="mb-4 mx-4">
        <div>
          <div className="mb-4">
            <div className="flex">
              {renderFieldAndValue(
                "Lending Pool",
                "Lend East #1: Emerging Asia Fintech Pool"
              )}
            </div>
            {renderFieldAndValue(
              "Protection Amount",
              <input type="number" className="border rounded-md w-full p-2" />
            )}
            {renderFieldAndValue(
              "Duration",
              <input type="number" className="border rounded-md w-full p-2" />
            )}
            <div>
              {renderFieldAndValue("Max Premium Price", "1234")}
              {hasEnoughUsdcBalance() ? null : (
                <h5 className="block text-left text-customPink text-base font-normal">
                  You don&apos;t have enough USDC balance:&nbsp;
                  {numeral(usdcBalance).format(USDC_FORMAT)}&nbsp;USDC
                </h5>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className={`text-white text-base bg-customBlue px-8 py-4 rounded-md cursor-pointer min-w-[330px] ${
                loading ? "disabled:opacity-90" : "disabled:opacity-50"
              } disabled:cursor-not-allowed`}
              onClick={renewProtection}
              disabled={
                loading // ||
                // !protectionPoolService ||
                // !protectionPoolAddress ||
                // !protectionAmount ||
                // calculatingPremiumPrice ||
                // !protectionDurationInDays ||
                // !tokenId ||
                // !lendingPoolAddress ||
                // !hasEnoughUsdcBalance() ||
                // premiumAmount === 0
              }
            >
              {loading ? (
                <LoadingButton loading={loading}>
                  <CircularProgress color="secondary" size={16} />
                </LoadingButton>
              ) : (
                "Confirm Protection Renewal"
              )}
            </button>
          </div>
          <div className="text-xs mt-6 text-center">
            By clicking &quot;Confirm Protection Purchase&quot;, you agree to
            Carapace&apos;s&nbsp;
            <span className="underline">Terms of Service&nbsp;</span>
            and acknowledge that you have read and understand the&nbsp;
            <span className="underline">Carapace protocol disclaimer.</span>
          </div>
        </div>
      </DialogContent>
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

export default RenewProtectionPopUp;
