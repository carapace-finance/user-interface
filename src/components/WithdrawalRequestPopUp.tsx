import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider
} from "@mui/material";
import { Tooltip } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { WithdrawalRequestInput } from "@type/types";

const WithdrawalRequestPopUp = (props) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<WithdrawalRequestInput>({ defaultValues: { amount: "0" } });

  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, protectionPoolAddress } = props;
  const [requestableAmount, setRequestableAmount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setValue("amount", "0");
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
    setValue("amount", requestableAmount.toString());
  };

  const onSubmit = () => {
    requestedWithdrawal();
  }; // your form submit function which will invoke after successful validation

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
        convertNumberToUSDC(parseFloat(getValues("amount")))
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("The requestWithdrawal transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully requested to withdraw ${getValues(
            "amount"
          )} USDC from the protection pool!`
        );
        setTimeout(() => {
          reset();
          onClose();
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
      <div className="flex justify-end mr-4">
        <IconButton onClick={onClose}>
          <span className="text-black">×</span>
        </IconButton>
      </div>
      <DialogTitle className="mt-6">Withdrawal Request</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <h4 className="text-left text-base font-medium mb-3">
            Protection Pool
          </h4>
          <div className="flex justify-left mb-3 text-base">
            {protectionPoolAddress}
          </div>
          <div>
            <h4 className="text-left text-base font-medium mb-3">
              Request Amount
            </h4>
            <div className="rounded-2xl mb-4">
              <div>
                <input
                  className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
                  type="number"
                  {...register("amount", {
                    min: 1,
                    max: requestableAmount,
                    required: true
                  })}
                />
                {errors.amount && (
                  <h5 className="block text-left text-customPink text-base leading-tight font-normal mb-4">
                    the withdrawal request amount must be in between 0 and your
                    deposited amount
                  </h5>
                )}
                {/* <TextField
                InputProps={{
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
              /> */}
              </div>
            </div>
            <div className="text-right mr-5 pb-4">
              Requestable Amount:&nbsp;
              {numeral(requestableAmount).format(USDC_FORMAT) + " USDC"}
            </div>
          </div>
          <Divider />
          <div className="pt-4">
            <h4 className="flex justify-left mb-4 text-base font-medium">
              Estimated Stats
            </h4>
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
          <input
            className="text-white bg-customBlue rounded-md px-12 py-4 mb-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-none"
            type="submit"
            value="Confirm Withdrawal Request"
            disabled={
              loading || !protectionPoolService || !protectionPoolAddress
            }
          />
          <div className="flex"></div>
          <LoadingButton loading={loading}></LoadingButton>
          <div className="text-sm">
            By clicking &quot;Confirm Withdrawal Request&quot;, you agree to
            Carapace&apos;s&nbsp;
            <span className="underline">Terms of Service&nbsp;</span>
            and acknowledge that you have read and understand the&nbsp;
            <span className="underline">Carapace protocol disclaimer.</span>
          </div>
        </DialogContent>
      </form>
      <SuccessPopup
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Dialog>
  );
};

export default WithdrawalRequestPopUp;
