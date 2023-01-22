import LoadingButton from "@mui/lab/LoadingButton";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton
} from "@mui/material";
import { Tooltip } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { convertNumberToUSDC, USDC_FORMAT } from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import numeral from "numeral";
import { WithdrawalInput } from "@type/types";

const WithdrawalPopUp = (props) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid }
  } = useForm<WithdrawalInput>({ defaultValues: { amount: "0" } });

  const { protectionPoolService } = useContext(ApplicationContext);
  const { open, onClose, protectionPoolAddress } = props;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setSuccessMessage("");
    setError("");
    setValue("amount", "0");
    setLoading(false);
  };

  // reset values on each open
  useEffect(() => {
    reset();
  }, [open]);

  const setMaxAmount = async () => {
    setValue("amount", props.requestedWithdrawalAmount);
  };

  const onSubmit = () => {
    withdraw();
  }; // your form submit function which will invoke after successful validation

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log("The withdrawal transaction failed");
    setError("Failed to withdraw...");
    setTimeout(() => {
      reset();
    }, 2000);
  };

  const withdraw = async () => {
    setLoading(true);

    try {
      const tx = await protectionPoolService.withdraw(
        protectionPoolAddress,
        convertNumberToUSDC(parseFloat(getValues("amount")))
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("The withdrawal transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully withdrew ${getValues(
            "amount"
          )} USDC from the protection pool!`
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
      <DialogTitle className="mt-6">Withdraw</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <h4 className="text-left text-base font-medium mb-3">
            Protection Pool
          </h4>
          <div className="flex justify-left mb-3 text-base">
            Goldfinch Protection Pool #1
          </div>
          <div>
            <h4 className="text-left text-base font-medium mb-3">
              Withdraw Amount
            </h4>
            <div className="rounded-2xl mb-4">
              <div>
                <input
                  className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
                  type="number"
                  {...register("amount", {
                    min: 1,
                    max: numeral(props.requestedWithdrawalAmount).value(),
                    required: true
                  })}
                  onWheel={(e: any) => e.target.blur()}
                />
                {errors.amount && (
                  <h5 className="block text-left text-customPink text-base leading-tight font-normal mb-4">
                    the withdrawal amount must be in between 0 and your
                    requested amount
                  </h5>
                )}
                {/* <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="flex">
                      <p className="text-customLightBlue pl-6">($)</p>
                      <p>USDC</p>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" className="">
                      <IconButton
                        disabled={!protectionPoolService}
                        onClick={setMaxAmount}
                        size="sm"
                        className="py-1 px-5 bg-transparent text-customLightBlue border border-customLightBlue rounded-xl"
                      >
                        Max
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              /> */}
              </div>
              <div className="text-right mr-5 mb-1">
                Requested Withdrawal Amount:&nbsp;
                {numeral(props.requestedWithdrawalAmount).format(USDC_FORMAT) +
                  " USDC"}
              </div>
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
                  <Tooltip content="Fees you pay to the Ethereum network" placement="right">
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
          <button
            className={`text-white bg-customBlue rounded-md px-12 py-4 mb-8 mt-8 transition duration-500 ease min-w-[230px] select-none focus:outline-none focus:shadow-outline cursor-pointer ${
              loading ? "disabled:opacity-90" : "disabled:opacity-50"
            } disabled:cursor-not-allowed`}
            type="submit"
            disabled={
              loading ||
              !protectionPoolService ||
              !protectionPoolAddress ||
              !isValid
            }
          >
            {loading ? (
              <LoadingButton loading={loading}>
                <CircularProgress color="secondary" size={16} />
              </LoadingButton>
            ) : (
              "Confirm Withdraw"
            )}
          </button>
          <div className="text-sm">
            By clicking &quot;Confirm Withdraw&quot;, you agree to
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

export default WithdrawalPopUp;
